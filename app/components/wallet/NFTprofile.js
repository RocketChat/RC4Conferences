import { Alert } from 'react-bootstrap';

const NFTProfile = () => {
  return (
    <Alert variant="warning" className="mb-0">
      NFT profile sync was removed with the deprecated Fauna/Superprofile
      integration.
    </Alert>
  );
};

export default NFTProfile;
