import { useEffect } from 'react';
import GoogleDriveClient from '../auth/google/googleDriveClient';

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
