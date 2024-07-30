import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Navbar from './components/Navbar';

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:3001/graphql';
const httpLink = createHttpLink({ uri: GRAPHQL_ENDPOINT });
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return { headers: { ...headers, authorization: token ? `Bearer ${token}` : '' } };
});
const cache = new InMemoryCache({
  typePolicies: {
    User: 
      { feilds: {
        SavedBooks: {
          merge(existing = [], incoming = []) {
            const existingBooks = new Map (
            existing.map((book) => [book.bookId, book])
          );
          const newBooks = new Map (
            incoming.map((book) => [book.bookId, book])
          );
          return [...existingBooks.values(), ...newBooks.values()];
        }
        }
      }}
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
