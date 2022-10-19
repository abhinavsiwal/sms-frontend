import React from 'react'
import "./style.css"

function IDCard() {
  return (
  <>
        <header className='identityCard__header d-flex'>
          <img className='logo' src='https://bethesda.edumanager.in/uploads/2021-04-17T16-09-33Bethesda-Logo.jpeg' alt='logo'/>
          <div className='d-flex flex-column text-center ml-3'>
            <div>BETHESDA ACADEMY</div>
            <div>Identity Card</div>
          </div>
        </header>
        <div className="identityCard__profile">
          <div className="identityCard__visual">
            <img src="https://bethesda.edumanager.in/uploads/2022-01-02T11-51-411.jpg" alt="" />
          </div>
          <ul className="identityCard__list list-unstyled">
            <li><strong>Roll No. :</strong> <span>123456</span></li>
            <li><strong>Name :</strong> <span>Paogoumang Haokip</span></li>
            <li><strong>Class :</strong> <span>Class-B</span></li>
            <li><strong>Section :</strong> <span>Section A</span></li>
            <li><strong>Gender :</strong> <span>Male</span></li>
            <li><strong>Date of birth :</strong> <span>25/03/2017</span></li>
            <li><strong>Contact No. :</strong> <span>+91 9612963449</span></li>
            <li><strong>Blood Group :</strong> <span>O+</span></li>
          </ul>
        </div>
        <footer className="identityCard__footer">
          <div className="filled">
            <span>
              S. Hengcham, Bethesda Mun, K. Mongjang Road, B.P.O - Koite Churachandpur, Manipur - 795128 - +91 9920056806
            </span>
          </div>
        </footer>
      </>
  )
}

export default IDCard