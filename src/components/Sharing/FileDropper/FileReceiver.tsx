/* eslint-disable security/detect-object-injection */
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";

import FileStore from "../../../store/FileStore";
import Button from "../../Button";
import FileItem from "./FileItem";

const Wrapper = styled.div`
  width: 100%;
`;

const FilesWrapper = styled.div`
  box-sizing: border-box;
  height: 380px;
  width: 100%;
  display: flex;
  border-radius: 5px;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  margin-bottom: 24px;
  background-color: #111827;

  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 8px;
    height: 3px;
  }
  ::-webkit-scrollbar-track {
    background-color: #111827;
  }
  ::-webkit-scrollbar-track-piece {
    background-color: #111827;
  }
  ::-webkit-scrollbar-thumb {
    height: 50px;
    background-color: #111827;
    border-radius: 3px;
  }
  ::-webkit-resizer {
    background-color: #111827;
  }
`;

const FileItemWrapper = styled.div`
  margin-bottom: 8px;
  width: 100%;
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const FileReceiver = () => {
  const handleDownload = (fileHash: string): void => {
    const a = document.createElement("a");
    const blob = new Blob(FileStore.fileHashToDataMap[fileHash]);

    a.href = window.URL.createObjectURL(blob);
    a.download = FileStore.fileHashToMetadataMap[fileHash].name;
    a.click();
    a.remove();
  };

  const handleClearDownloads = () => {
    FileStore.clearFilesData();
  };

  const getFilesData = () => {
    return Object.keys(FileStore.fileHashToMetadataMap).map((fileHash) => {
      const file = FileStore.fileHashToMetadataMap[fileHash];
      const receiveProgress = FileStore.filesReceiveProgress[fileHash];

      return (
        <FileItemWrapper key={fileHash}>
          <FileItem
            file={file}
            progress={receiveProgress}
            fileHash={fileHash}
            enableDownload={receiveProgress >= file.size}
            onDownload={() => {
              return handleDownload(fileHash);
            }}
          />
        </FileItemWrapper>
      );
    });
  };

  return (
    <Wrapper>
      <FilesWrapper>{getFilesData()}</FilesWrapper>
      <Button backgroundColor="#ef4444" onClick={handleClearDownloads}>
        Clear Downloads
      </Button>
    </Wrapper>
  );
};

export default observer(FileReceiver);
