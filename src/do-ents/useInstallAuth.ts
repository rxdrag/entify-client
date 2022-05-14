import { ClientError, gql } from "graphql-request";
import { useCallback, useState } from "react";
import { createGraphQLClient } from "./createGraphQLClient";
import { ServerError } from "./ServerError";
import { InstallInput } from "./useInstallRegistry";
import { PostOptions } from "./PostOptions";

export interface InstallServiceInput extends InstallInput{
  id: number;
}

export interface InstallAuthInput extends InstallServiceInput {
  url: string;
  admin: string;
  adminPassword: string;
  withDemo: boolean;
}

export function useInstallAuth(
  options?: PostOptions
): [
  (data: InstallAuthInput) => void,
  { loading: boolean; error: ServerError | undefined }
] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ServerError | undefined>();

  const post = useCallback(
    (input: InstallAuthInput) => {
      const graphQLClient = createGraphQLClient(options?.serverUrl);
      const postMutation = gql`
        mutation install($input: InstallInput!) {
          install(input: $input)
        }
      `;

      setLoading(true);
      setError(undefined);
      graphQLClient
        .request(postMutation, { input })
        .then((data) => {
          setLoading(false);
          options?.onCompleted && options?.onCompleted(data["install"]);
        })
        .catch((err: ClientError) => {
          const error: ServerError | undefined = err.response?.errors
            ? err.response.errors[0]
            : err;
          setLoading(false);
          setError(error);
          console.error(err);
          error && options?.onError && options?.onError(error);
        });
    },
    [options]
  );

  return [post, { loading, error }];
}
