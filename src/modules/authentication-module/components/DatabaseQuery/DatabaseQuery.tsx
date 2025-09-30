/**
 * Database Query Component
 * Provides a simple interface to query the user database
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent
} from '@mui/material';
import { ExpandMore, Search, Refresh } from '@mui/icons-material';
import { UserDatabase } from '../../services/userDatabase';
import { authTrackingService } from '../../services/authTrackingService';

interface QueryResult {
  users: any[];
  stats: any;
  events: any[];
}

const DatabaseQuery: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Predefined queries
  const predefinedQueries = [
    {
      name: 'Get All Users',
      query: 'SELECT * FROM users',
      description: 'Retrieve all users from the database'
    },
    {
      name: 'Get Verified Users',
      query: 'SELECT * FROM users WHERE emailVerified = true',
      description: 'Get all users with verified email addresses'
    },
    {
      name: 'Get Unverified Users',
      query: 'SELECT * FROM users WHERE emailVerified = false',
      description: 'Get all users with unverified email addresses'
    },
    {
      name: 'Get User Statistics',
      query: 'SELECT COUNT(*) as total, SUM(emailVerified) as verified FROM users',
      description: 'Get user statistics and counts'
    },
    {
      name: 'Get Recent Auth Events',
      query: 'SELECT * FROM auth_events ORDER BY timestamp DESC LIMIT 10',
      description: 'Get the 10 most recent authentication events'
    },
    {
      name: 'Get Email Verification Events',
      query: 'SELECT * FROM auth_events WHERE action LIKE "%EMAIL_VERIFICATION%"',
      description: 'Get all email verification related events'
    }
  ];

  const executeQuery = async (queryText: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let queryResults: QueryResult = {
        users: [],
        stats: {},
        events: []
      };

      // Parse and execute the query
      const queryLower = queryText.toLowerCase().trim();
      
      if (queryLower.includes('select * from users') || queryLower.includes('get all users')) {
        queryResults.users = UserDatabase.getAllUsers();
      } else if (queryLower.includes('emailverified = true') || queryLower.includes('verified users')) {
        queryResults.users = UserDatabase.getAllUsers().filter(user => user.emailVerified);
      } else if (queryLower.includes('emailverified = false') || queryLower.includes('unverified users')) {
        queryResults.users = UserDatabase.getAllUsers().filter(user => !user.emailVerified);
      } else if (queryLower.includes('count') || queryLower.includes('statistics')) {
        queryResults.stats = UserDatabase.getUserStats();
      } else if (queryLower.includes('auth_events') || queryLower.includes('events')) {
        queryResults.events = authTrackingService.getAllEvents();
      } else if (queryLower.includes('email_verification')) {
        queryResults.events = authTrackingService.getAllEvents().filter(
          (event: any) => event.action.includes('EMAIL_VERIFICATION')
        );
      } else {
        // Default: get all users
        queryResults.users = UserDatabase.getAllUsers();
      }

      setResults(queryResults);
    } catch (err) {
      setError(`Query execution failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredefinedQuery = (queryText: string) => {
    setQuery(queryText);
    executeQuery(queryText);
  };

  const refreshData = () => {
    executeQuery(query || 'SELECT * FROM users');
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontSize: '15px', fontWeight: 'normal' }}>
        Database Query Interface
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom sx={{ fontSize: '12px' }}>
        Query the user database and authentication events
      </Typography>
      
      <Box sx={{ 
        borderTop: '0.05px solid #2c3e50', 
        margin: '30px 0' 
      }} />
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        This interface provides access to all stored data for advanced database operations.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        {/* Query Input */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Execute Query
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your query (e.g., SELECT * FROM users)"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => executeQuery(query)}
                  disabled={isLoading || !query.trim()}
                  startIcon={<Search />}
                >
                  Execute Query
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={refreshData}
                  startIcon={<Refresh />}
                >
                  Refresh
                </Button>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Predefined Queries */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Predefined Queries
              </Typography>
              
              {predefinedQueries.map((predefined, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle2">
                      {predefined.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {predefined.description}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 2 }}>
                      {predefined.query}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handlePredefinedQuery(predefined.query)}
                    >
                      Execute
                    </Button>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Results */}
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Query Results
              {isLoading && <Chip label="Loading..." color="primary" sx={{ ml: 2 }} />}
            </Typography>

            {results && (
              <>
                {/* User Statistics */}
                {results.stats && Object.keys(results.stats).length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      User Statistics
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4" color="primary">
                            {results.stats.totalUsers || 0}
                          </Typography>
                          <Typography variant="body2">Total Users</Typography>
                        </Paper>
                      </Box>
                      <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4" color="success.main">
                            {results.stats.verifiedUsers || 0}
                          </Typography>
                          <Typography variant="body2">Verified</Typography>
                        </Paper>
                      </Box>
                      <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4" color="warning.main">
                            {results.stats.unverifiedUsers || 0}
                          </Typography>
                          <Typography variant="body2">Unverified</Typography>
                        </Paper>
                      </Box>
                      <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4" color="info.main">
                            {results.stats.adminUsers || 0}
                          </Typography>
                          <Typography variant="body2">Admins</Typography>
                        </Paper>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Users Table */}
                {results.users && results.users.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Users ({results.users.length})
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Verified</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Created</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {results.users.map((user, index) => (
                            <TableRow key={user.id || index}>
                              <TableCell>{user.id}</TableCell>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Chip
                                  label={user.emailVerified ? 'Yes' : 'No'}
                                  color={user.emailVerified ? 'success' : 'warning'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={user.role || 'user'}
                                  color={user.role === 'admin' ? 'primary' : 'default'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                {new Date(user.createdAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Events Table */}
                {results.events && results.events.length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Authentication Events ({results.events.length})
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Action</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Success</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Error</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {results.events.slice(0, 20).map((event, index) => (
                            <TableRow key={event.id || index}>
                              <TableCell>
                                <Chip
                                  label={event.action}
                                  color={event.success ? 'success' : 'error'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{event.email || '-'}</TableCell>
                              <TableCell>
                                <Chip
                                  label={event.success ? 'Yes' : 'No'}
                                  color={event.success ? 'success' : 'error'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                {new Date(event.timestamp).toLocaleString()}
                              </TableCell>
                              <TableCell>{event.errorReason || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {!results.users?.length && !results.events?.length && !results.stats && (
                  <Alert severity="info">
                    No results found. Try a different query.
                  </Alert>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DatabaseQuery;