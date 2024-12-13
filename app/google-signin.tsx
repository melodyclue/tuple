import { SubmitButton } from '@/components/submit-button';
import { signInWithGoogle } from '@/actions/auth.action';

export const GoogleSignIn = () => {
  return (
    <form>
      <input type="hidden" name="username" value="test_username" />
      <input type="hidden" name="provider" value="google" />
      <SubmitButton formAction={signInWithGoogle} pendingText="Signing in...">
        Sign in with Google
      </SubmitButton>
    </form>
  );
};
