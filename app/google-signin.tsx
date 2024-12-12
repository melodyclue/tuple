import { SubmitButton } from '@/components/submit-button';
import { signInWithOAuthAction } from './actions';

export const GoogleSignIn = () => {
  return (
    <form>
      <input type="hidden" name="username" value="test_username" />
      <input type="hidden" name="provider" value="google" />
      <SubmitButton formAction={signInWithOAuthAction} pendingText="Signing in...">
        Sign in with Google
      </SubmitButton>
    </form>
  );
};
