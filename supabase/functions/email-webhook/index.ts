// Cloudflare Email Worker Webhook Handler
// Receives incoming emails from Cloudflare and stores them in the database
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload = await req.json();
    console.log('Incoming email webhook:', JSON.stringify(payload).slice(0, 200));

    // Parse Cloudflare Email Worker payload
    // Cloudflare sends: { from, to, subject, text, html, headers, messageId }
    const {
      from,
      to,
      subject,
      text: body_text,
      html: body_html,
      headers,
      messageId: message_id,
    } = payload;

    if (!from || !to) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: from, to' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract email parts
    const fromMatch = from.match(/^(?:"?([^"<]*)"?\s*)?<?([^>]+)>?$/);
    const from_name = fromMatch?.[1]?.trim() || from;
    const from_address = fromMatch?.[2]?.trim() || from;

    const to_address = Array.isArray(to) ? to[0] : to;

    // Find the account this email belongs to
    const { data: account } = await supabase
      .from('email_accounts')
      .select('id, user_id')
      .eq('address', to_address.toLowerCase())
      .single();

    // Also check aliases
    let targetUserId = account?.user_id;
    let targetAccountId = account?.id;

    if (!account) {
      // Check aliases
      const { data: alias } = await supabase
        .from('aliases')
        .select('user_id, account_id')
        .eq('alias_address', to_address.toLowerCase())
        .eq('is_active', true)
        .single();

      if (alias) {
        targetUserId = alias.user_id;
        targetAccountId = alias.account_id;
      }
    }

    if (!targetUserId) {
      // Check wildcard / catch-all
      const domain = to_address.split('@')[1];
      const { data: catchAll } = await supabase
        .from('aliases')
        .select('user_id, account_id')
        .eq('catch_all', true)
        .ilike('alias_address', `%@${domain}`)
        .single();

      if (catchAll) {
        targetUserId = catchAll.user_id;
        targetAccountId = catchAll.account_id;
      }
    }

    // Insert email into database
    const { data: email, error } = await supabase
      .from('emails')
      .insert({
        account_id: targetAccountId || null,
        user_id: targetUserId || '00000000-0000-0000-0000-000000000000',
        from_address,
        from_name,
        to_address,
        subject: subject || '(no subject)',
        body_text: body_text || '',
        body_html: body_html || '',
        folder: 'inbox',
        is_read: false,
        is_starred: false,
        message_id: message_id || null,
        headers: headers ? JSON.stringify(headers) : null,
        received_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('DB insert error:', error);
      return new Response(
        JSON.stringify({ error: `Database error: ${error.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email stored successfully:', email.id);
    return new Response(
      JSON.stringify({ success: true, emailId: email.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
