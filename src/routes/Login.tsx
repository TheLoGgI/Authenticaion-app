// @ts-nocheck

import {
  Box,
  Button,
  Input as ChakraInput,
  Fade,
  FormControl,
  FormHelperText,
  FormLabel,
  InputProps,
  Text,
} from "@chakra-ui/react"
import { NavLink, useOutletContext } from "react-router-dom"
import { forwardRef, useRef, useState } from "react"

import { DeprecatedLayoutGroupContext } from "framer-motion"
import { Props } from "../components"

const Input: React.FC<any> = forwardRef((props, ref) => {
  return <ChakraInput bgColor="white" ref={ref} {...props} />
})

const FormField: React.FC<Props> = ({ children, ...props }) => {
  return (
    <FormControl mt="4" {...props}>
      {children}
    </FormControl>
  )
}

// PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
//   .then((available) => {
//     if (available) {
//       console.log("pv is acc" + available)
//       // We can proceed with the creation of a PublicKeyCredential
//       // with this authenticator
//     } else {
//       // Use another kind of authenticator or a classical login/password
//       // workflow
//     }
//   })
//   .catch((err) => {
//     // Something went wrong
//     console.error(err)
//   })

export function Login() {
  const usernameEmail = useRef<HTMLInputElement | undefined>()
  const password = useRef<HTMLInputElement | undefined>()
  const [error, setError] = useState({
    invalidEmail: false,
    invalidPassword: false,
    missingEmail: false,
    missingPassword: false,
    wrongUsername: false,
    wrongPassword: false,
  })

  const handleSubmit: React.FormEventHandler<HTMLFormElement> | undefined = (
    event
  ) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    console.log("usernameEmail.current?.value: ", usernameEmail.current?.value)
    console.log("password.current?.value: ", password.current?.value)
    const options = {
      method: "POST",
      mode: "cors",
      body: formData,
      credentials: "include" /* Expecting a cookie */,
      headers: {
        Accept: "application/json",
        "Access-Control-Request-Method": "POST",
        Origin: location.origin,
        // Authorization: usernameEmail.current?.value,
      },
    }

    console.log("options: ", options)
    // console.log("options: ", options)
    fetch(`http://localhost:3000/cookie/login`, options)
      .then((res) => {
        console.log("res: ", res)
        if (res.ok) return res.json()
        setError((p) => ({
          invalidEmail: false,
          invalidPassword: false,
          missingEmail: false,
          missingPassword: false,
          wrongUsername: true,
          wrongPassword: true,
        }))
      })
      .then((data) => {
        sessionStorage.setItem("sessionId", data.sessionId)
      })
    // .then((res) => res.())
  }

  const handleUISubmit: React.FormEventHandler<HTMLFormElement> | undefined = (
    event
  ) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData)

    if (!data.username) setError((e) => ({ ...e, invalidEmail: true }))
    if (!data.password) setError((e) => ({ ...e, invalidPassword: true }))

    if (data.username && data.password)
      setError((e) => ({ ...e, wrongPassword: true, wrongUsername: true }))
  }

  // https://www.w3.org/TR/webauthn/#sctn-sample-scenarios
  const publicKey: PublicKeyCredentialCreationOptions = {
    challenge: /* random bytes generated by the server */ Uint8Array.from(
      "bGFzc2VBYWtqYWVyOnNlY3JldFBhc3N3b3Jk",
      (c) => c.charCodeAt(0)
    ),
    rp: /* relying party */ {
      name: "Lasse Aakjær",
      id: "lasseaakjaer.com",
    },
    user: {
      id: Uint8Array.from(
        window.atob("MIIBkzCCATigAwIBAjCCAZMwggE4oAMCAQIwggGTMII="),
        (c) => c.charCodeAt(0)
      ),
      name: "alex.mueller@example.com",
      displayName: "Alex Müller",
    },
    pubKeyCredParams: [
      {
        type: "public-key",
        alg: -7, // "ES256" as registered in the IANA COSE Algorithms registry
      },
      {
        type: "public-key",
        alg: -257, // Value registered by this specification for "RS256"
      },
    ],
    authenticatorSelection: {
      /*  https://w3c.github.io/webauthn/#dom-authenticatorselectioncriteria-userverification
        This enumeration’s values describe authenticators' attachment modalities. 
        Relying Parties use this to express a preferred authenticator attachment modality when calling navigator.credentials.create() to create a credential, 
        and clients use this to report the authenticator attachment modality used to complete a registration or authentication ceremony. 
      */
      // Try to use UV (User verification) if possible. This is also the default.
      userVerification: "preferred" /*   "cross-platform" */,
      /*   Authenticator Attachment Modality
      A platform authenticator is attached using a client device-specific transport, called platform attachment, and is usually not removable from the client device. 
      A public key credential bound to a platform authenticator is called a platform credential.

      A roaming authenticator is attached using cross-platform transports, called cross-platform attachment. 
      Authenticators of this class are removable from, and can "roam" between, client devices. 
      A public key credential bound to a roaming authenticator is called a roaming credential. 
      */
    },
    timeout: 360000, // 6 minutes
    excludeCredentials: [
      // Don’t re-register any authenticator that has one of these credentials
      {
        id: Uint8Array.from(
          window.atob("ufJWp8YGlibm1Kd9XQBWN1WAw2jy5In2Xhon9HAqcXE="),
          (c) => c.charCodeAt(0)
        ),
        type: "public-key",
      },
      {
        id: Uint8Array.from(
          window.atob("E/e1dhZc++mIsz4f9hb6NifAzJpF1V4mEtRlIPBiWdY="),
          (c) => c.charCodeAt(0)
        ),
        type: "public-key",
      },
    ],

    // Make excludeCredentials check backwards compatible with credentials registered with U2F
    extensions: { appidExclude: "https://acme.example.com" },
  }

  const webAuth = () => {
    navigator.credentials
      .create({ publicKey })
      .then((newCredentialInfo) => {
        // console.log("newCredentialInfo: ", newCredentialInfo)
        // Send new credential info to server for verification and registration.
        // @ts-ignore
        const response = newCredentialInfo.response
        // console.log("response: ", response)
        const clientExtensionsResults =
          newCredentialInfo.getClientExtensionResults()
        // console.log("clientExtensionsResults: ", clientExtensionsResults)
      })
      .catch((err) => {
        // No acceptable authenticator or user refused consent. Handle appropriately.
        console.error(err)
      })
  }

  const passwordError =
    error.invalidPassword || error.missingPassword || error.wrongPassword
  const usernameError =
    error.invalidEmail || error.missingEmail || error.wrongUsername

  return (
    <Box p="4" w="md" bg="gray.100" borderRadius="8">
      <form onSubmit={handleSubmit}>
        <Text fontSize="xl" fontWeight="medium">
          Login Form
        </Text>
        <FormField>
          <FormLabel>Username / Email</FormLabel>
          <Input
            ref={usernameEmail}
            type="text"
            name="email"
            defaultValue="lasse@hotmail.com"
            placeholder="JohnDoe / john-doe@gmail.com.."
            autoComplete="username"
            borderColor={usernameError ? "red.600" : undefined}
            border={usernameError ? "2px solid" : undefined}
            onFocus={() => {
              setError((p) => ({
                ...p,
                invalidEmail: false,
                wrongUsername: false,
                missingEmail: false,
              }))
            }}
          />
        </FormField>
        <Fade in={usernameError}>
          <Box
            py="20px"
            px="10px"
            mt="4"
            bg="red.400"
            rounded="md"
            shadow="md"
            display={usernameError ? "block" : "none"}
          >
            {error.wrongUsername && (
              <Text>Email and username does not belong to any user</Text>
            )}
            {error.missingEmail && <Text>Field can not be empty</Text>}
            {error.invalidEmail && (
              <Text>
                The input is not a valid input, make sure your email or username
                spelled correctly
              </Text>
            )}
          </Box>
        </Fade>
        <FormField>
          <FormLabel>Password</FormLabel>
          <Input
            ref={password}
            type="password"
            defaultValue="secretPassword"
            name="password"
            placeholder="Secret password"
            autoComplete="current-password"
            borderColor={passwordError ? "red.600" : undefined}
            border={passwordError ? "2px solid" : undefined}
            onFocus={() => {
              setError((p) => ({
                ...p,
                invalidPassword: false,
                wrongPassword: false,
                missingPassword: false,
              }))
            }}
          />
        </FormField>
        <Fade in={passwordError}>
          <Box
            py="20px"
            px="10px"
            mt="4"
            bg="red.400"
            rounded="md"
            shadow="md"
            display={passwordError ? "block" : "none"}
          >
            {error.wrongPassword && (
              <Text>Password does not match username</Text>
            )}
            {error.missingPassword && <Text>Field can not be empty</Text>}
          </Box>
        </Fade>
        <Button colorScheme="blue" type="submit" mt="8" w="full">
          Login
        </Button>
        <NavLink to="/register">
          <Button
            colorScheme="blue"
            variant="outline"
            type="button"
            mt="4"
            w="full"
          >
            SignUp
          </Button>
        </NavLink>
      </form>
    </Box>
  )
}

export function SignUp() {
  const username = useRef<HTMLInputElement | undefined>()
  const password = useRef<HTMLInputElement | undefined>()
  const email = useRef<HTMLInputElement | undefined>()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> | undefined = (
    event
  ) => {
    event.preventDefault()

    fetch(`http://127.0.0.1:5000/create/user`, {
      method: "POST",
      body: JSON.stringify({
        username: username.current?.value,
        password: password.current?.value,
        email: email.current?.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(console.log)
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
        <Button colorScheme="blue" type="submit" mt="8" w="full">
          Register Account
        </Button>
      </form>
    </Box>
  )
}
