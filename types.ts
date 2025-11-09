
export interface SpeedDataPoint {
  time: number;
  download: number;
  upload: number;
}

export enum TestStatus {
  IDLE = 'idle',
  TESTING_DOWNLOAD = 'testing_download',
  TESTING_UPLOAD = 'testing_upload',
  FINISHED = 'finished',
  FAILED = 'failed',
}
