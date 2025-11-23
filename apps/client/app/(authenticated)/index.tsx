import { Redirect } from 'expo-router';

const AuthenticatedScreen = () => {
  return <Redirect href="/onboarding/basic-info" />;
};

export default AuthenticatedScreen;
