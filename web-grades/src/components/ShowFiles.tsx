import React, { useContext, useEffect, useState } from 'react';
import { FirebaseProps } from '../types/PropInterfaces';
import { withFirebaseHOC } from '../firebase';
import { AuthContext } from './AuthContext';
import { fileUrlAndType } from '../firebase/firebase';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, makeStyles, colors } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  pageButtons: {
    margin: theme.spacing(1),
    backgroundColor: colors.blueGrey[800],
    color: '#fff',
    flexGrow: 1,
  },
  imageStyle: {
    maxWidth: '33vw',
  },
}));

interface Props extends FirebaseProps {
  assignment: string;
  files: string[];
  studentId?: string;
}

const ShowFiles: React.FC<Props> = ({ firebase, assignment, files, studentId }) => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const [fileUrls, setFileUrls] = useState([] as fileUrlAndType[]);
  const [numPages, setNumPages] = useState({ numPages: null });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    async function getFiles() {
      const uid = studentId ? studentId : currentUser.uid;
      const urls = await firebase.getFilesForAssignment('7th', assignment, uid, files);
      setFileUrls(urls);
    }
    getFiles();
  }, [assignment, currentUser.uid, files, firebase, studentId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages({ numPages });
  };

  if (fileUrls.length <= 0) {
    return <></>;
  }
  return (
    <>
      {/* eslint-disable-next-line array-callback-return */}
      {fileUrls.map((file) => {
        if (file.fileType.includes('image')) {
          return (
            <div key={file.fileUrl}>
              <img
                className={classes.imageStyle}
                key={file.fileUrl}
                src={file.fileUrl}
                alt="file uploaded for this assignment"
              />
            </div>
          );
        }
        if (file.fileType.includes('pdf')) {
          return (
            <div key={file.fileUrl}>
              <Button className={classes.pageButtons} onClick={() => setCurrentPage(currentPage - 1)}>
                Previous Page
              </Button>
              <Button className={classes.pageButtons} onClick={() => setCurrentPage(currentPage + 1)}>
                Next Page
              </Button>
              <Document key={file.fileUrl} file={file.fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={currentPage} />
              </Document>
              <p>
                Page {currentPage} of {numPages.numPages}
              </p>
            </div>
          );
        }
      })}
    </>
  );
};

export default withFirebaseHOC(ShowFiles);
