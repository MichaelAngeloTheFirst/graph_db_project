import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  'bolt://your-neo4j-server-address:7687',
  neo4j.auth.basic('your-username', 'your-password')
);

export default driver;