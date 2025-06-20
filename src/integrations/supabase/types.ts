export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campanhas: {
        Row: {
          arquivo: string | null
          canais: string[]
          contatos_enviados: number
          contatos_total: number
          created_at: string | null
          data_fim: string | null
          data_inicio: string
          id: string
          mensagem: string
          nome: string
          remetente: string
          status: Database["public"]["Enums"]["campanha_status"]
          taxa_sucesso: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          arquivo?: string | null
          canais?: string[]
          contatos_enviados?: number
          contatos_total?: number
          created_at?: string | null
          data_fim?: string | null
          data_inicio: string
          id?: string
          mensagem: string
          nome: string
          remetente: string
          status?: Database["public"]["Enums"]["campanha_status"]
          taxa_sucesso?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          arquivo?: string | null
          canais?: string[]
          contatos_enviados?: number
          contatos_total?: number
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string
          id?: string
          mensagem?: string
          nome?: string
          remetente?: string
          status?: Database["public"]["Enums"]["campanha_status"]
          taxa_sucesso?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campanhas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          configuracao: Json
          created_at: string | null
          id: string
          nome: string
          sector_id: string
          status: Database["public"]["Enums"]["connection_status"]
          tipo: Database["public"]["Enums"]["connection_type"]
          updated_at: string | null
        }
        Insert: {
          configuracao?: Json
          created_at?: string | null
          id?: string
          nome: string
          sector_id: string
          status?: Database["public"]["Enums"]["connection_status"]
          tipo: Database["public"]["Enums"]["connection_type"]
          updated_at?: string | null
        }
        Update: {
          configuracao?: Json
          created_at?: string | null
          id?: string
          nome?: string
          sector_id?: string
          status?: Database["public"]["Enums"]["connection_status"]
          tipo?: Database["public"]["Enums"]["connection_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connections_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_tags: {
        Row: {
          contact_id: string
          created_at: string | null
          id: string
          tag_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          id?: string
          tag_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_tags_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          avatar: string
          canal: Database["public"]["Enums"]["contact_canal"]
          created_at: string | null
          email: string | null
          endereco: string | null
          id: string
          nome: string
          observacoes: string | null
          sector_id: string | null
          status: Database["public"]["Enums"]["contact_status"]
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar: string
          canal?: Database["public"]["Enums"]["contact_canal"]
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          sector_id?: string | null
          status?: Database["public"]["Enums"]["contact_status"]
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string
          canal?: Database["public"]["Enums"]["contact_canal"]
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          sector_id?: string | null
          status?: Database["public"]["Enums"]["contact_status"]
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          ativo: boolean
          cor: string
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean
          cor?: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean
          cor?: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          ativo: boolean
          cor: string
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean
          cor?: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean
          cor?: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tenant_activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          tenant_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_activity_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          price_per_month: number | null
          start_date: string
          status: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          price_per_month?: number | null
          start_date?: string
          status?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          price_per_month?: number | null
          start_date?: string
          status?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          database_url: string
          domain: string | null
          features: Json | null
          id: string
          max_contacts: number | null
          max_users: number | null
          metadata: Json | null
          name: string
          slug: string
          status: Database["public"]["Enums"]["tenant_status"]
          updated_at: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          database_url: string
          domain?: string | null
          features?: Json | null
          id?: string
          max_contacts?: number | null
          max_users?: number | null
          metadata?: Json | null
          name: string
          slug: string
          status?: Database["public"]["Enums"]["tenant_status"]
          updated_at?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          database_url?: string
          domain?: string | null
          features?: Json | null
          id?: string
          max_contacts?: number | null
          max_users?: number | null
          metadata?: Json | null
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["tenant_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      user_sectors: {
        Row: {
          created_at: string | null
          id: string
          sector_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          sector_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          sector_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sectors_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_sectors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string
          cargo: string | null
          created_at: string | null
          email: string
          id: string
          nome: string
          perfil: Database["public"]["Enums"]["user_profile"]
          status: Database["public"]["Enums"]["user_status"]
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar: string
          cargo?: string | null
          created_at?: string | null
          email: string
          id: string
          nome: string
          perfil?: Database["public"]["Enums"]["user_profile"]
          status?: Database["public"]["Enums"]["user_status"]
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string
          cargo?: string | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          perfil?: Database["public"]["Enums"]["user_profile"]
          status?: Database["public"]["Enums"]["user_status"]
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      campanha_status:
        | "rascunho"
        | "agendada"
        | "em_andamento"
        | "pausada"
        | "finalizada"
        | "cancelada"
        | "erro"
      connection_status: "ativo" | "inativo" | "configurando"
      connection_type:
        | "whatsapp"
        | "instagram"
        | "facebook"
        | "telegram"
        | "webchat"
      contact_canal:
        | "whatsapp"
        | "instagram"
        | "facebook"
        | "telegram"
        | "webchat"
      contact_status: "online" | "offline" | "ausente"
      subscription_plan: "basic" | "professional" | "enterprise" | "custom"
      tenant_status: "active" | "inactive" | "suspended" | "trial"
      user_profile: "admin" | "gerente" | "atendente"
      user_status: "ativo" | "inativo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      campanha_status: [
        "rascunho",
        "agendada",
        "em_andamento",
        "pausada",
        "finalizada",
        "cancelada",
        "erro",
      ],
      connection_status: ["ativo", "inativo", "configurando"],
      connection_type: [
        "whatsapp",
        "instagram",
        "facebook",
        "telegram",
        "webchat",
      ],
      contact_canal: [
        "whatsapp",
        "instagram",
        "facebook",
        "telegram",
        "webchat",
      ],
      contact_status: ["online", "offline", "ausente"],
      subscription_plan: ["basic", "professional", "enterprise", "custom"],
      tenant_status: ["active", "inactive", "suspended", "trial"],
      user_profile: ["admin", "gerente", "atendente"],
      user_status: ["ativo", "inativo"],
    },
  },
} as const
