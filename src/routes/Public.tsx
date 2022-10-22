import { Box, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react"

import { useAuthContext } from "../App"

export const Public = () => {
  return (
    <Box>
      <Heading>Public data</Heading>
      <Text>Always available</Text>
    </Box>
  )
}

export const Private = () => {
  const { user } = useAuthContext()

  if (user && user.validated == false)
    return (
      <Box color="red.400">
        <Heading>Private data</Heading>
        <Text>Is not available to this user</Text>
      </Box>
    )

  return (
    <Box>
      <Heading>Private data</Heading>
      <UnorderedList>
        <ListItem>Username: {user?.username} </ListItem>
        <ListItem>Uid: {user?.uid} </ListItem>
        <ListItem>Validated: {user?.validated.toString()} </ListItem>
      </UnorderedList>
    </Box>
  )
}
