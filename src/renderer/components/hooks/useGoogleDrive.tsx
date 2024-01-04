import { useEffect } from 'react';

export const a = '';

export const useGoogleDrive = () => {
  useEffect(() => {
    const requestFiles = async () => {
      const drive = GoogleDriveClient();
      console.log(drive);
    };

    requestFiles();
  }, []);
};
