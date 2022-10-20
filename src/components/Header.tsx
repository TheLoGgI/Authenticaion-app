import { Button, HStack } from "@chakra-ui/react"

import { NavLink } from "react-router-dom"

type HeaderType = {
  context: [
    React.Context<{
      feedbackBehavior: string
    }>,
    React.Dispatch<
      React.SetStateAction<
        React.Context<{
          feedbackBehavior: string
        }>
      >
    >
  ]
}

export function Header() {
  return (
    <HStack as="nav" p="4" bgColor="gray.200" borderRadius="8" justify="center">
      <NavLink to="/">
        <Button colorScheme="blue" variant="outline">
          Home
        </Button>
      </NavLink>
      <NavLink to="/private/data">
        <Button colorScheme="blue" variant="outline">
          Private Data
        </Button>
      </NavLink>
      <NavLink to="/public/data">
        <Button colorScheme="blue" variant="outline">
          Public Data
        </Button>
      </NavLink>
      <NavLink to="/login">
        <Button colorScheme="blue">Login</Button>
      </NavLink>
    </HStack>
  )
}
