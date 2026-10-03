import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { FunctionsHttpError } from '@supabase/supabase-js';

// ─── Fetch emails ────────────────────────────────────────────────────────────
export function useEmails(folder?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['emails', user?.id, folder],
    queryFn: async () => {
      let q = supabase
        .from('emails')
        .select('*')
        .order('received_at', { ascending: false });

      if (folder && folder !== 'starred') {
        q = q.eq('folder', folder);
      } else if (folder === 'starred') {
        q = q.eq('is_starred', true);
      }

      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    refetchInterval: 30000, // poll every 30s (no real-time support)
  });
}

// ─── Mark email read ─────────────────────────────────────────────────────────
export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('emails')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['emails'] }),
  });
}

// ─── Toggle star ──────────────────────────────────────────────────────────────
export function useToggleStar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, starred }: { id: string; starred: boolean }) => {
      const { error } = await supabase
        .from('emails')
        .update({ is_starred: !starred })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['emails'] }),
  });
}

// ─── Move to folder (delete = trash) ─────────────────────────────────────────
export function useMoveEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, folder }: { id: string; folder: string }) => {
      const { error } = await supabase
        .from('emails')
        .update({ folder })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['emails'] }),
  });
}

// ─── Send email via Edge Function ─────────────────────────────────────────────
export function useSendEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      to: string;
      cc?: string;
      bcc?: string;
      subject: string;
      text?: string;
      html?: string;
      from_address?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('send-email', { body: payload });
      if (error) {
        let msg = error.message;
        if (error instanceof FunctionsHttpError) {
          try {
            const text = await error.context?.text();
            msg = `[${error.context?.status}] ${text || msg}`;
          } catch { /* use original */ }
        }
        throw new Error(msg);
      }
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['emails'] }),
  });
}

// ─── Email accounts ───────────────────────────────────────────────────────────
export function useEmailAccounts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['email_accounts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_accounts')
        .select('*')
        .order('is_primary', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

// ─── Create email account ─────────────────────────────────────────────────────
export function useCreateEmailAccount() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (payload: {
      username: string;
      domain: string;
      display_name?: string;
      is_primary?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('email_accounts')
        .insert({
          user_id: user!.id,
          address: `${payload.username}@${payload.domain}`,
          username: payload.username,
          domain: payload.domain,
          display_name: payload.display_name,
          is_primary: payload.is_primary ?? false,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['email_accounts'] }),
  });
}

// ─── Subdomains ───────────────────────────────────────────────────────────────
export function useSubdomains() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['subdomains', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subdomains')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

// ─── Create subdomain ─────────────────────────────────────────────────────────
export function useCreateSubdomain() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ subdomain, parent }: { subdomain: string; parent: string }) => {
      const { data, error } = await supabase
        .from('subdomains')
        .insert({
          user_id: user!.id,
          subdomain,
          full_domain: `${subdomain}.${parent}`,
          parent_domain: parent,
          status: 'active',
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subdomains'] }),
  });
}

// ─── Delete subdomain ─────────────────────────────────────────────────────────
export function useDeleteSubdomain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('subdomains').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subdomains'] }),
  });
}

// ─── Aliases ──────────────────────────────────────────────────────────────────
export function useAliases() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['aliases', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aliases')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

// ─── Create alias ─────────────────────────────────────────────────────────────
export function useCreateAlias() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (payload: {
      alias_address: string;
      forwards_to: string;
      catch_all?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('aliases')
        .insert({ user_id: user!.id, ...payload })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['aliases'] }),
  });
}

// ─── Delete alias ─────────────────────────────────────────────────────────────
export function useDeleteAlias() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('aliases').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['aliases'] }),
  });
}

// ─── Sign-in history ──────────────────────────────────────────────────────────
export function useSigninHistory() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['signin_history', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('signin_history')
        .select('*')
        .order('signed_in_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

// ─── Password vault ───────────────────────────────────────────────────────────
export function usePasswordVault() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['password_vault', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('password_vault')
        .select('*')
        .eq('user_id', user!.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });
}

// ─── Upsert password vault ────────────────────────────────────────────────────
export function useUpsertPasswordVault() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from('password_vault')
        .upsert({ user_id: user!.id, ...payload, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['password_vault'] }),
  });
}

// ─── Integrations ──────────────────────────────────────────────────────────────
export function useIntegrations() {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('is_available', true)
        .order('category');
      if (error) throw error;
      return data || [];
    },
  });
}

// ─── User integrations ─────────────────────────────────────────────────────────
export function useUserIntegrations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user_integrations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_integrations')
        .select('*, integration:integrations(*)')
        .order('connected_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

// ─── Toggle user integration ───────────────────────────────────────────────────
export function useToggleIntegration() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({
      integrationId,
      apiKey,
      isActive,
      existingId,
    }: {
      integrationId: string;
      apiKey?: string;
      isActive: boolean;
      existingId?: string;
    }) => {
      if (existingId) {
        const { error } = await supabase
          .from('user_integrations')
          .update({ is_active: isActive, api_key_enc: apiKey })
          .eq('id', existingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_integrations')
          .insert({
            user_id: user!.id,
            integration_id: integrationId,
            api_key_enc: apiKey,
            is_active: isActive,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['user_integrations'] }),
  });
}

// ─── Security reports ─────────────────────────────────────────────────────────
export function useSecurityReports() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['security_reports', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_reports')
        .select('*')
        .order('scanned_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

// ─── Run security scan ────────────────────────────────────────────────────────
export function useRunSecurityScan() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (isGlobal = false) => {
      const { data, error } = await supabase.functions.invoke('security-scan', {
        body: { user_id: user?.id, is_global: isGlobal },
      });
      if (error) {
        let msg = error.message;
        if (error instanceof FunctionsHttpError) {
          try { msg = await error.context?.text() || msg; } catch { /* */ }
        }
        throw new Error(msg);
      }
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['security_reports'] }),
  });
}

// ─── Email counts by folder ────────────────────────────────────────────────────
export function useEmailCounts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['email_counts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emails')
        .select('folder, is_read, is_starred');
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach(e => {
        if (!e.is_read) {
          counts[e.folder] = (counts[e.folder] || 0) + 1;
        }
        if (e.is_starred) {
          counts['starred'] = (counts['starred'] || 0) + 1;
        }
      });
      return counts;
    },
    enabled: !!user,
    refetchInterval: 30000,
  });
}
