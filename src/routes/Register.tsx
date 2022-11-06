import { Box, Button, FormHelperText, FormLabel, Text } from "@chakra-ui/react"
import { CombinedCredentials, FormField, Input } from "./Login"
import { bufferDecode, bufferEncode } from "../utils"

import { useRef } from "react"

const registerWithAuthn = () => {
  const options: RequestInit = {
    method: "GET",
    mode: "cors",
    // credentials: "include" /* Expecting a cookie */,
    headers: {
      Accept: "application/json",
      "Access-Control-Request-Method": "GET",
      Origin: location.origin,
    },
  }

  fetch(`http://localhost:3000/webauthn/beginregister`, options)
    .then((res) => {
      console.log("res: ", res)
      if (res.ok) return res.json()
    })
    .then((data) => {
      console.log("data: ", data)
      const publicKey = {
        publicKey: {
          ...data.options.publicKey,
          id: bufferDecode(data.options.publicKey.user.id),
          challenge: /* random bytes generated by the server */ bufferDecode(
            data.options.publicKey.challenge
          ),
          user: {
            ...data.options.publicKey.user,
            id: bufferDecode(data.options.publicKey.user.id),
          },
        },
      }

      navigator.credentials
        .create(publicKey)
        .then((newCredentialInfo) => {
          console.log("newCredentialInfo: ", newCredentialInfo)
          const newCredentials = newCredentialInfo as CombinedCredentials

          fetch("http://localhost:3000/webauthn/finishregistration", {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
              userUid: data.userUid,
              id: newCredentials?.id,
              rawId: bufferEncode(newCredentials.rawId as unknown as number),
              type: newCredentials?.type,
              response: {
                attestationObject: bufferEncode(
                  newCredentials?.response.attestationObject
                ),
                clientDataJSON: bufferEncode(
                  newCredentials?.response.clientDataJSON
                ),
              },
            }),
            headers: {
              Accept: "application/json",
              "Access-Control-Request-Method": "POST",
              Origin: location.origin,
              // "Access-Control-Allow-Credentials": "true",
              // credentials: "include",
              // Authorization: usernameEmail.current?.value,
            },
          }).then(
            (res) => {
              console.log("res: ", res)
            },
            (err) => {
              console.log("Failed to finish Registration", err)
            }
          )
        })
        .catch((err) => {
          // No acceptable authenticator or user refused consent. Handle appropriately.
          console.error(err)
        })
    })
    .catch((err) => {
      // No acceptable authenticator or user refused consent. Handle appropriately.
      console.error({ RequestError: err })
    })
}

export function SignUp() {
  const username = useRef<HTMLInputElement | undefined>()
  const password = useRef<HTMLInputElement | undefined>()
  const email = useRef<HTMLInputElement | undefined>()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> | undefined = (
    event
  ) => {
    event.preventDefault()

    const options: RequestInit = {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        username: username.current?.value,
        password: password.current?.value,
        email: email.current?.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }

    fetch(`http://127.0.0.1:3000/create/user`, options)
      .then((res) => res.json())
      .then((res) => {
        console.log("userData: ", res)
        if (res.status) registerWithAuthn()
      })
  }

  return (
    <Box p="4" w="md" bg="gray.100" borderRadius="8">
      <form onSubmit={handleSubmit}>
        <Text fontSize="xl" fontWeight="medium">
          Sign Up Form
        </Text>
        <FormField>
          <FormLabel>Username</FormLabel>
          <Input type="text" ref={username} placeholder="John Doe" />
          <FormHelperText>What do you what to be called?</FormHelperText>
        </FormField>
        <FormField>
          <FormLabel>Email</FormLabel>
          <Input type="email" ref={email} placeholder="john-doe@gmail.com" />
          <FormHelperText>We'll never share your email.</FormHelperText>
        </FormField>
        <FormField>
          <FormLabel>Password</FormLabel>
          <Input type="password" ref={password} />
          <FormHelperText>
            Password has to be at least 8 characters long and have both numbers
            and letters
          </FormHelperText>
        </FormField>
        <FormField>
          <FormLabel>Re-Password</FormLabel>
          <Input type="password" />
          <FormHelperText>Confirm your password</FormHelperText>
        </FormField>
        <Button
          type="button"
          colorScheme="purple"
          variant="outline"
          mt="8"
          w="full"
          onClick={registerWithAuthn}
        >
          Register without password using Web Authn
        </Button>
        <Button colorScheme="blue" type="submit" mt="4" w="full">
          Register Account
        </Button>
      </form>
    </Box>
  )
}