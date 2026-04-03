import { supabase } from "../supabase.js";

// REGISTER USER
export const registerUser = async (req, res) => {
  const { email, password, fullName, organization } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          organization: organization,
        },
      },
    });

    if (error) throw error;

    res.status(201).json({
      message: "Registration successful. Verify your email.",
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

    if (error) throw error;

    res.status(200).json({
      message: "Authorization Granted",
      session: data.session,
      user: data.user,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};