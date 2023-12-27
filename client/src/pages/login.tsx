import { useLogin } from "@refinedev/core";
import { useEffect, useRef } from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ThemedTitleV2 } from "@refinedev/mui";
import { yariga } from '../assets';

import { CredentialResponse } from "../interfaces/google";

  export const Login: React.FC = () => {
    const { mutate: login } = useLogin<CredentialResponse>();
    const { mutateAsync: create } = useCreate();
  
    const GoogleButton = (): JSX.Element => {
      const divRef = useRef<HTMLDivElement>(null);
  
      useEffect(() => {
        if (typeof window === 'undefined' || !window.google || !divRef.current) {
          return;
        }
  
        try {
          window.google.accounts.id.initialize({
            ux_mode: 'popup',
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: async (res: CredentialResponse) => {
              if (res.credential) {
                login(res);
  
                CHANGE: add user to MongoDB
                const profileObj = res.credential ? parseJwt(res.credential) : null;
                if (profileObj) {
                  const { data } = await create({
                    resource: 'api/v1/users',
                    values: {
                      name: profileObj.name,
                      email: profileObj.email,
                      avatar: profileObj.picture,
                    },
                  });
  
                  console.log('data', data);
                }
              }
            },
          });
          window.google.accounts.id.renderButton(divRef.current, {
            theme: 'filled_blue',
            size: 'medium',
            type: 'standard',
          });
        } catch (error) {
          console.log(error);
        }
      }, []); // you can also add your client id as dependency here
  
      return <div ref={divRef} />;
    };
  
    return (
      <Box
        component="div"
        sx={{ backgroundColor: '#FCFCFC' }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src={yariga} alt="Yariga Logo" />
            <Box mt={4}>
              <GoogleButton />
            </Box>
          </Box>
        </Container>
      </Box>
    );
  };
  