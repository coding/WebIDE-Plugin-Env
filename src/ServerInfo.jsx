import React, { Component, PropTypes } from 'react';
import global from './global';
const config = global.sdk.config;

const Progress = ({ num }) => (
  <div className="progress">
    <div
      className="curr"
      style={{
        width: `${num}%`,
      }
    }></div>
  </div>
)

const ServerInfo = () => {
  if (config.serverInfo) {
    return (
      <div className="server-info">
        <div className="title">
          <i className="fa fa-desktop"></i>
          Server Info
        </div>
        <div className="info-item">
          <label>IP: {config.serverInfo.ipWan}</label>
          <label>Core: 1</label>
          <label>Memory: 1G</label>
        </div>
        <div className="info-item">
          <label>CPU <Progress num={50} /></label>
          <label>MEM <Progress num={50} /></label>
          <label>HDD <Progress num={50} /></label>
        </div>
      </div>
    );
  }
  return (<div></div>)
};

export default ServerInfo;
