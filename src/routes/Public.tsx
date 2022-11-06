import {
  Avatar,
  Box,
  Divider,
  Flex,
  HStack,
  Heading,
  ListItem,
  Spinner,
  Text,
  UnorderedList,
} from "@chakra-ui/react"
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"

// import { useAuthContext } from "../App"

export const Public = () => {
  return (
    <Box>
      <Heading>Public data</Heading>
      <Text>Always available</Text>
    </Box>
  )
}

export const Private = () => {
  // const { user } = useAuthContext()
  const { user, isAuthenticated } = useAuth0()

  if (!isAuthenticated)
    return (
      <Box color="red.400">
        <Heading>Private data</Heading>
        <Text>Is not available to this user</Text>
      </Box>
    )

  return (
    <Box>
      <Heading>Private data</Heading>

      <Box bg="purple.100" borderRadius="10" p="8" mt="4">
        <HStack spacing="4">
          <Avatar name={user?.nickname} src={user?.picture} />
          <Text>
            {user?.name}, {user?.nickname}
          </Text>
        </HStack>
        <Divider my="8" />
        <UnorderedList>
          <ListItem>Email: {user?.email} </ListItem>
          <ListItem>Verified: {String(user?.email_verified)} </ListItem>
          {user?.updated_at && (
            <ListItem>
              <>Updated At: {new Date(user?.updated_at).toLocaleDateString()}</>
            </ListItem>
          )}
        </UnorderedList>
      </Box>
    </Box>
  )
}

// export default withAuthenticationRequired(Private, {
//   onRedirecting: () => <Spinner />,
// })
