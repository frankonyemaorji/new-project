import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

// app/api/auth/[...nextauth]/route.ts

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          console.log('NextAuth: Attempting login for:', credentials.email);
          
          // Call your actual backend login API
          // Based on the error, your API expects both username and email
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,    // Use email for login
              password: credentials.password,
            }),
          });

          console.log('NextAuth: Backend login response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('NextAuth: Login successful, user data:', { ...data, access_token: '[HIDDEN]' });
            
            // Based on your API, the response should contain user info and tokens
            return {
              id: data.uid || data.user?.uid,
              email: data.email || data.user?.email,
              name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
              username: data.username || data.user?.username,
              role: data.role || data.user?.role || 'user',
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            };
          } else {
            const errorText = await response.text();
            console.error('NextAuth: Login failed:', response.status, errorText);
            return null;
          }
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Store the access token and refresh token in the JWT
      if (user) {
        token.role = user.role;
        token.username = user.username;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      
      // Handle token refresh here if needed
      // You can implement logic to refresh tokens using your /api/v1/auth/refresh endpoint
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };