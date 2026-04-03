import { supabase } from "../supabase.js";

// REGISTER USER
export const registerUser = async (req, res) => {
  const { email, password, fullName, organization } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Metadata is saved in the auth.users table and 
        // copied to public.profiles by your SQL trigger
        data: {
          full_name: fullName,
          organization: organization,
        },
      },
    });

    if (error) throw error;

    res.status(201).json({
      message: "Perimeter Profile Created. Please verify your email to authorize access.",
      user: data.user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Specifically catch the "Email not confirmed" error for the UI
      if (error.message.includes("Email not confirmed")) {
        return res.status(403).json({ 
          error: "Verification Required. Please click the link in your email to authorize this session." 
        });
      }
      throw error;
    }

    // Success response for AuditShield Dashboard
    res.status(200).json({
      message: "Authorization Granted",
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata.full_name,
        organization: data.user.user_metadata.organization
      },
    });
  } catch (error) {
    // 401 for Invalid Credentials
    res.status(401).json({ error: error.message });
  }
};