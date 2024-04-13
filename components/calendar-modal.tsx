"use client"

import React, { useState } from 'react';
import Modal from 'react-modal';
import { CopyToClipboard } from "react-copy-to-clipboard";

Modal.setAppElement('body');

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

export default function CalendarModal({ id }: { id: string }) {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <button onClick={openModal}>캘린더 링크 공유</button>
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
      // contentLabel="Example Modal"
      >
        <div>
          <h3>링크 공유를 통한 일정 조율</h3>
          <div>링크를 복사해 그룹원과 일정을 공유하세요.</div>
          <form>
            <input type='text' value={process.env.NEXT_PUBLIC_APP_HOME_URL + '/member/' + id} readOnly />
            <button onClick={closeModal}>취소</button>
            <CopyToClipboard
              text={process.env.NEXT_PUBLIC_APP_HOME_URL + '/member/' + id}
              onCopy={() => alert("링크가 복사되었습니다")}
            >
              <button>링크복사</button>
            </CopyToClipboard>
          </form>
        </div>

      </Modal>
    </div>
  );
}