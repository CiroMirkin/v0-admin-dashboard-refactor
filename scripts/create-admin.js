import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function createAdminUser() {
  const email = 'roma_descartables@hotmail.com'
  const password = 'admin123'
  
  try {
    // Try to sign up the admin user
    /*AQUI CONECTAR*/
    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password,
    // })
    
    // Mock user creation - reemplazar con llamada real
    const data = { user: { id: 'mock-user-id' } }
    const error = null
    
    if (error) {
      console.error('Error creating user:', error)
      return
    }
    
    console.log('User created successfully:', data)
    
    // Update user to confirm email using admin client
    if (data.user?.id) {
      /*AQUI CONECTAR*/
      // const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      //   data.user.id,
      //   { email_confirm: true }
      // )
      
      // Mock email confirmation - reemplazar con llamada real
      const updateError = null
      
      if (updateError) {
        console.error('Error confirming email:', updateError)
        return
      }
      
      console.log('Email confirmed successfully')
    }
    
    // Try to sign in
    /*AQUI CONECTAR*/
    // const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // })
    
    // Mock sign in - reemplazar con llamada real
    const signInData = { user: { id: 'mock-user-id', email: email } }
    const signInError = null
    
    if (signInError) {
      console.error('Error signing in:', signInError)
      return
    }
    
    console.log('Sign in successful:', signInData)
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

createAdminUser()