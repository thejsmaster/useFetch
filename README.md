# use-fetch-react-xhr

### make api calls from react components at ease

use-fetch-react-xhr is a lightweight React hook that allows you to fetch data from an API endpoint. It gives you more control over HTTP request than fetch or even axios. it lets you cancel the request while it's loading suitable for typeahead functionality. it uses XMLHttpRequest (XHR) instead of the fetch() API. It provides a simple and flexible API for making network requests, including support for canceling requests and handling errors.

### Installation

To install use-fetch-react-xhr, run:

```sh
npm install use-fetch-react-xhr
```
## Example (counter)

https://stackblitz.com/edit/react-ts-rcxsti?file=App.tsx

### Usage

```js
import { useFetch } from "use-fetch-react-xhr";

const App = () => {
  const { isLoading, isSuccess, isError, data, error, load, cancel } = useFetch(
    {
      url: "https://example.com/api/data",
      type: "GET",
      headers: {
        Authorization: "Bearer TOKEN",
      },
      autoLoad: true,
      callOnMount: true,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {isSuccess && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <button onClick={load}>Reload</button>
      <button onClick={cancel}>Cancel</button>
    </div>
  );
};
```

### API

#### useFetch

The useFetch hook takes an object with the following properties:

- url (required) - The URL to fetch data from.
- payload (optional) - Optional data to include in the request body.
- type (optional) - The HTTP method to use (e.g. GET, POST, PUT, DELETE). Defaults to "GET".
- headers (optional) - Additional headers to include in the request.
- autoLoad (optional: default - false) - Whether to automatically load data when the component mounts or when the parameters change.
- callOnMount (optional: default - false) - Whether to call the load function when the component mounts.

It returns an object with the following properties:

- isLoading - Whether the request is currently loading.
- isSuccess - Whether the request succeeded.
- isError - Whether the request failed.
- data - The response data if the request succeeded.
- error - The error message if the request failed.
- isCancelled - Whether the request was cancelled.
- load - A function to manually start the request.
- cancel - A function to cancel the request.

## Contributing

Contributions are always welcome! If you find a bug or want to add a feature, please open an issue or submit a pull request.

Before submitting a pull request, please make sure to:

- Add tests for any new functionality.
- Update the README.md file to include any new options or changes to the API.

## License

use-fetch-react-xhr is MIT licensed.
