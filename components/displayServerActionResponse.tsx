import { cn } from '@/lib/utils';

type Props = {
  result: {
    data?: {
      message?: string;
    };
    serverError?: string;
    validationErrors?: Record<string, string[] | undefined>;
  };
};

const MessageBox = ({ type, content }: { type: 'success' | 'error'; content: React.ReactNode }) => {
  return <div className={cn('rounded-md p-4', type === 'success' ? 'bg-green-500' : 'bg-red-500')}>{content}</div>;
};

export const DisplayServerActionResponse = ({ result }: Props) => {
  const { data, serverError, validationErrors } = result;
  if (data?.message) {
    return <MessageBox type="success" content={data.message} />;
  }
  if (serverError) {
    return <MessageBox type="error" content={serverError} />;
  }
  if (validationErrors) {
    return (
      <MessageBox
        type="error"
        content={Object.keys(validationErrors).map((key) => {
          return (
            <p key={key}>
              {key}: {validationErrors[key as keyof typeof validationErrors]}
            </p>
          );
        })}
      />
    );
  }
  return null;
};
