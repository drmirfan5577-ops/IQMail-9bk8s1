// Send Email via Resend API
// Handles compose, reply, and forward operations
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { to, cc, bcc, subject, html, text, from_address, reply_to_id } = body;

    if (!to || !subject) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get sender's primary email account
    let senderAddress = from_address;
    if (!senderAddress) {
      const { data: account } = await supabaseAdmin
        .from('email_accounts')
        .select('address, display_name')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single();
      senderAddress = account?.address || `user@iqmail.online`;
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Resend: API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build email payload for Resend
    const emailPayload: Record<string, unknown> = {
      from: senderAddress,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap;">${text || ''}</pre>`,
      text: text || '',
    };
    if (cc) emailPayload.cc = Array.isArray(cc) ? cc : [cc];
    if (bcc) emailPayload.bcc = Array.isArray(bcc) ? bcc : [bcc];
    if (reply_to_id) emailPayload.reply_to = reply_to_id;

    // Send via Resend
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error('Resend error:', resendData);
      return new Response(
        JSON.stringify({ error: `Resend: ${resendData.message || resendData.name || 'Send failed'}` }),
        { status: resendRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email sent via Resend:', resendData.id);

    // Store sent email in DB
    const { data: savedEmail, error: dbError } = await supabaseAdmin
      .from('emails')
      .insert({
        user_id: user.id,
        from_address: senderAddress,
        to_address: Array.isArray(to) ? to.join(', ') : to,
        cc_address: cc || null,
        bcc_address: bcc || null,
        subject,
        body_text: text || '',
        body_html: html || '',
        folder: 'sent',
        is_read: true,
        message_id: resendData.id,
        received_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('DB save error (non-fatal):', dbError);
    }

    return new Response(
      JSON.stringify({ success: true, messageId: resendData.id, emailId: savedEmail?.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Send email error:', err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
