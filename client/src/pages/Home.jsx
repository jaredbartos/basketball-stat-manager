import { useQuery } from '@apollo/client';
import { GET_RECENTLY_UPDATED_TEAMS, GET_RANKED_PERFORMANCES } from '../utils/queries';
import {
  Heading,
  Center,
  Wrap,
  WrapItem,
  Text,
  Flex,
  Box,
  VStack,
  Link as ChakraLink,
  useDisclosure
} from '@chakra-ui/react';
import TeamCard from '../components/TeamCard';
import PerformanceTable from '../components/PerformanceTable';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import Auth from '../utils/auth';
import { Link as ReactRouterLink } from 'react-router-dom';

export default function Home() {
  // Declare modal variables for login
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose
  } = useDisclosure();

  // Declare modal variables for signup
  const {
    isOpen: isSignupOpen,
    onOpen: onSignupOpen,
    onClose: onSignupClose
  } = useDisclosure();
  const {
    loading: loadingTeams,
    data: teamData,
    error: teamError
  } = useQuery(GET_RECENTLY_UPDATED_TEAMS);
  const [teams, setTeams] = useState([]);
  const [performances, setPerformances] = useState([]);

  const {
    loading: loadingPerformances,
    data: performancesData
  } = useQuery(GET_RANKED_PERFORMANCES, { variables: { field: 'points' } })

  useEffect(() => {
    if (teamData) {
      setTeams(teamData.recentlyUpdatedTeams);
    }
    if (performancesData) {
      setPerformances(performancesData.rankPerformanceByField);
    }
  }, [teamData, performancesData, setTeams, setPerformances]);


  return (
    <>
      <Box>
        <Flex justify='center'>
          <VStack>
            <Heading
              as='h2'
              size='xl'
              color='custom.blue'
              mt={8}
            >
              Welcome to HeatCheck!
            </Heading>
            <Heading
              as='h3'
              size='md'
              color='custom.blue'
            >
              The World Leader (sort of) in Amateur Basketball Stat Management
            </Heading>
            <Text w={['95%', null, null, 800]} my={10}>
              {
                !Auth.loggedIn()
                ?
                <>
                  <ChakraLink
                    onClick={onLoginOpen}
                    color='blue'
                  >
                    Log in{' '}
                  </ChakraLink>
                  or{' '}
                  <ChakraLink
                    onClick={onSignupOpen}
                    color='blue'
                  >
                    sign up{' '}
                  </ChakraLink>
                  for a new account to begin recording and tracking your own team(s) stats!
                  Before adding your own numbers, feel free to dive in to what the community has already begun tracking
                  themselves!
                </>
                :
                <>
                  Greetings, {Auth.getProfile().data.username}! Head to{' '}
                  <ChakraLink
                    as={ReactRouterLink}
                    to='/dashboard'
                    color='blue'
                  >
                    your dashboard{' '}
                  </ChakraLink>
                  to start or continue managing the stats of your own teams!
                  You can also stick around to check out the recent feats and
                  changes the community has made!
                </>
              }
              
            </Text>
          </VStack>
        </Flex>
        <Center h={100}>
          <Heading
            as='h2'
            color='custom.blue'
            size='lg'
          >
            Highest Scorers
          </Heading>
        </Center>
        <Box h={390} className='delay-4'>
          {
            loadingPerformances
            &&
            <LoadingSpinner />
          }
          {
            (!loadingPerformances && performances.length)
            &&
            <Flex
              justify='center'
            >
              <PerformanceTable
                performances={performances}
                isRanking={true}
              />
            </Flex>
          }
          {
            (!loadingPerformances && !performances.length)
            &&
            <Center>
              <Text fontSize='lg' my={20}>No games have been added yet!</Text>
            </Center>
          }
        </Box>
        <Center h={100}>
          <Heading
            as='h2'
            color='custom.blue'
            size='lg'
          >
            Recently Updated Teams
          </Heading>
        </Center>
        <Box m='auto' w={['95%']}>
        {
          loadingTeams
          &&
          <LoadingSpinner />
        }
        {
          (!loadingTeams && teams.length)
          &&
          <Flex flexWrap='wrap' justify='center'>
          {teams.map(team => 
              <TeamCard
                key={team._id}          
                teamId={team._id}
                players={team.players}
                teamName={team.name}
                league={team.league}
              />
          )}
          </Flex>
        }
        {
          (!loadingTeams && !teams.length)
          &&
          <Center>
            <Text fontSize='lg' my={20}>No teams have been added yet!</Text>
          </Center>
        }
        </Box>     
      </Box>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={onLoginClose}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={onSignupClose}
      />
    </>
  );
}