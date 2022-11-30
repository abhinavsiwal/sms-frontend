import React from 'react'
import "./style.css"

function IDCard() {
  return (
  <>
        <header className='identityCard__header d-flex'>
          <img className='logo' src='https://bethesda.edumanager.in/uploads/2021-04-17T16-09-33Bethesda-Logo.jpeg' alt='logo'/>
          <div className='d-flex flex-column text-center ml-3'>
            <div>YOUR SCHOOL NAME HERE</div>
            <div>Identity Card</div>
          </div>
        </header>
        <div className="identityCard__profile">
          <div className='id__card'>
            <div className="identityCard__visual">
              <img src="https://smsproject-bucket.s3.amazonaws.com/N5FLvmz…231049&Signature=eq%2FZPdsjUakqM9WtPJ2xrEjCPik%3D" alt="" />
            </div>
          </div>
          <ul className="identityCard__list list-unstyled">
            <li><strong>Name :</strong> <span>John Doe</span></li>
            <li><strong>Class :</strong> <span>Class-A</span></li>
            <li><strong>Section :</strong> <span>Section A</span></li>
            <li><strong>Roll No. :</strong> <span>123456</span></li>
            <li><strong>Gender :</strong> <span>Male</span></li>
            <li><strong>Date of birth :</strong> <span>25/03/2017</span></li>
            <li><strong>Contact No. :</strong> <span>+91 9612963449</span></li>
            <li><strong>Blood Group :</strong> <span>O+</span></li>
          </ul>
        </div>
        <footer className="identityCard__footer">
          <div className="filled">
            <span>
              S. Hengcham, Bethesda Mun, K. Mongjang Road, B.P.O - Koite Churachandpur, Manipur - XXXXXX - +91 XXXXX-XXXXX
            </span>
          </div>
        </footer>
      </>
  )
}

export default IDCard