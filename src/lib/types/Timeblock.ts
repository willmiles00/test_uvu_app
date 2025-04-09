export interface Timeblock {
   buildingAndRoom: string;
    CRN: string;
    Course: string;
    Instructor: string;
    meetingDays: string[] | undefined;
    meetingTime: string[] | undefined;
}


// this is what an timeblock would look like
// let exampleTimeblock: Timeblock = {
	// buildingAndRoom: 'CS 101',
    // CRN: '33434',
    // Course: 'DGM 1600',
    // Instructor: 'Thor Anderson',
    // meetingDays: ['Monday', 'Wednesday'],
    // meetingTime: ['08:00', '09:00'],
	// };