import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function confirmAdminUser() {
  const email = 'roma_descartables@hotmail.com'
  
  try {
    // Get user by email
    /*AQUI CONECTAR*/
    // const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    // Mock users list - reemplazar con llamada real
    const users = [{ id: 'mock-user-id', email: email }]
    const listError = null
    
    if (listError) {
      console.error('Error listing users:', listError)
      return
    }
    
    const adminUser = users.find(user => user.email === email)
    
    if (!adminUser) {
      console.error('Admin user not found')
      return
    }
    
    console.log('Found admin user:', adminUser.id)
    
    // Update user to confirm email
    /*AQUI CONECTAR*/
    // const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    //   adminUser.id,
    //   { email_confirm: true }
    // )
    
    // Mock email confirmation - reemplazar con llamada real
    const updateError = null
    
    if (updateError) {
      console.error('Error confirming email:', updateError)
      return
    }
    
    console.log('Email confirmed successfully')
    
    // Try to sign in
    /*AQUI CONECTAR*/
    // const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    //   email,
    //   password: 'admin123',
    // })
    
    // Mock sign in - reemplazar con llamada real
    const signInData = { session: { user: { email: email } } }
    const signInError = null
    
    if (signInError) {
      console.error('Error signing in:', signInError)
      return
    }
    
    console.log('Sign in successful:', signInData.session?.user?.email)
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

confirmAdminUser()