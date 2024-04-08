import { useAuth0 } from '@auth0/auth0-react';
import FileUploadButton from '../components/FileUploadButton';
import FilesList from '../components/FilesList';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export interface File {
  fildId: string;
  filename: string;
  url: string;
}

function DocsPage() {
  const [files, setFiles] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const { babyId } = useParams(); // Access the userId from the route parameters

  useEffect(() => {
    const fetchFilesData = async () => {
      const token = await getAccessTokenSilently();

      const searchParams = {
        babyId
      };

      const response = await fetch('http://localhost:3000/files/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(searchParams)
      });

      const data = await response.json();
      setFiles(data);
      console.log(data);
    };

    fetchFilesData();
  }, [getAccessTokenSilently, babyId]);

  return (
    <>
      <FileUploadButton />
      <FilesList files={files} />
    </>
  );
}

export default DocsPage;
