import React, { Component, PropTypes } from 'react';
import global from './global';
const config = global.sdk.config;

const Progress = ({ num }) => (
  <div className="progress">
    <div
      className="curr"
      style={{
        width: `${num}%`,
      }}
    ></div>
  </div>
);

const ServerInfo = () => {
  if (config.serverInfo) {
    return (
      <div className="server-info">
        <div className="logo">
          <i className="c-logo-icon">腾讯云</i>
        </div>
        <div className="server-info-content">
          {/* <div className="title">
            <i className="fa fa-desktop"></i>
            Server Info
          </div> */}
          <div className="info-item info-up">
            <div className="info-detail">
                <div className="info-line">
                    <label>IP: {config.serverInfo.ipWan}</label>
                </div>
                <div className="info-line">
                    <label>内核: 1</label>
                    <label>内存: 1G</label>
                </div>
            </div>
            <div className="info-link">
                <a href="https://console.cloud.tencent.com/lighthosting" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">查看专用主机</a>
            </div>
          </div>
          <div className="info-item">
            <div className="status">
              <label>CPU</label> <Progress num={10} />
            </div>
            <div className="status">
              <label>内存</label> <Progress num={60} />
            </div>
            <div className="status">
              <label>硬盘</label> <Progress num={30} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (<div />);
};

export default ServerInfo;
