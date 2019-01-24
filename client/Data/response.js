//times are in MINUTES elapsed since primary infected starts shedding virus

fake = {
    id: "lezombie",
    movement: [
        {time: 360, location: 'SISSR31'},
        {time: 720, location: 'SISSR32'},
        {time: 1120, location: 'SISSR33'},
        {time: 1320, location: 'SISSR34'},
		{time: 1570, location: 'SISGSR34'}
    ],
    contacts: [
        {
            timeContacted: 460,
            duration: 90,
            id: "1G001",
            movement: [
                {time: 200, location: 'SISSR34'},  //provide one location before contact
                {time: 460, location: 'SISSR31'},
                {time: 720, location: 'SOBGSR22'}, //have to handle movement out of the map
                {time: 900, location: 'SISSR32'},  //starting to infect 2G
                {time: 1320, location: 'SISSR34'}
            ],
            contacts: [ //2nd Gen
                {
                    timeContacted: 2100,
                    duration: 45,
                    id: "2G001",
                    movement: [
                        {time: 2000, location: 'SISSR21'},
                        {time: 2100, location: 'SISSR22'},
                        {time: 2300, location: 'SOESR24'}
                    ],
                    contacts: [

                    ]

                },
                {
                    timeContacted: 2100,
                    duration: 45,
                    id: "2G002",
                    movement: [
                        {time: 2000, location: 'SISSR21'},
                        {time: 2100, location: 'SISSR22'},
                        {time: 2300, location: 'SOESR24'}
                    ],
                    contacts: [

                    ]

                }
            ]
        },
        {
            timeContacted: 720,
            duration: 500,
            id: "1G002",
            movement: [
                {time: 360, location: 'SISGSR31'},
                {time: 720, location: 'SISSR32'},
                {time: 2250, location: 'SISSR31'},
                {time: 2400, location: 'SISSR32'},
                {time: 2600, location: 'SOBSR23'}
            ],
            contacts: [
                {
                    timeContacted: 2250,
                    duration: 45,
                    id: "2G003",
                    movement: [
                        {time: 2000, location: 'SISSR21'},
                        {time: 2100, location: 'SISSR22'},
                        {time: 2300, location: 'SOESR24'}
                    ],
                    contacts: [

                    ]

                },
                {
                    timeContacted: 2400,
                    duration: 45,
                    id: "2G004",
                    movement: [
                        {time: 2000, location: 'SISSR21'},
                        {time: 2400, location: 'SISSR32'},
                        {time: 2600, location: 'SOESR24'}
                    ],
                    contacts: [
                        {
                            id: 'X3XX',
                            timeContacted: 240,
                            movement: [
                                {time: 2000, location: 'SISSR21'},
                                {time: 2400, location: 'SISSR32'},
                                {time: 2600, location: 'SOESR24'}
                            ],
                            contacts: [
                                {
                                    id: 'X5XX',
                                    timeContacted: 1400,
                                    movement: [
                                        {time: 2000, location: 'SISSR21'},
                                        {time: 2400, location: 'SISSR32'},
                                        {time: 2600, location: 'SOESR24'}
                                    ],
                                },
                                {
                                    id: 'XXsX',
                                    timeContacted: 1720,
                                    movement: [
                                        {time: 2000, location: 'SISSR21'},
                                        {time: 2400, location: 'SISSR32'},
                                        {time: 2600, location: 'SOESR24'}
                                    ],
                                },
                                {
                                    id: 'XX4X',
                                    timeContacted: 1600,
                                    movement: [
                                        {time: 2000, location: 'SISSR21'},
                                        {time: 2400, location: 'SISSR32'},
                                        {time: 2600, location: 'SOESR24'}
                                    ],
                                    contacts: [
                                        {
                                            id: 'X2XX',
                                            timeContacted: 2100,
                                            movement: [
                                                {time: 2000, location: 'SISSR21'},
                                                {time: 2400, location: 'SISSR32'},
                                                {time: 2600, location: 'SOESR24'}
                                            ],
                                        },
                                        {
                                            id: 'XX7X',
                                            timeContacted: 1900,
                                            movement: [
                                                {time: 2000, location: 'SISSR21'},
                                                {time: 2400, location: 'SISSR32'},
                                                {time: 2600, location: 'SOESR24'}
                                            ],
                                        },
                                        {
                                            id: 'XgXX',
                                            timeContacted: 2430,
                                            movement: [
                                                {time: 2000, location: 'SISSR21'},
                                                {time: 2400, location: 'SISSR32'},
                                                {time: 2600, location: 'SOESR24'}
                                            ],
                                        }
                                    ]
                                }
                            ]
                        }
                    ]

                }
            ]
        },
		{
            timeContacted: 1320,
            duration: 90,
            id: "luckyguy",
            movement: [
                {time: 200, location: 'SISSR32'},  //provide one location before contact
                {time: 460, location: 'SISSR33'},
                {time: 1320, location: 'SISSR34'}, //have to handle movement out of the map
                {time: 900, location: 'SISSR32'},  //starting to infect 2G
                {time: 1320, location: 'SISSR34'}
            ],
            contacts: [ //2nd Gen
                {
                    timeContacted: 2100,
                    duration: 45,
                    id: "2G008",
                    movement: [
                        {time: 2000, location: 'SISSR21'},
                        {time: 2100, location: 'SISSR22'},
                        {time: 2300, location: 'SOESR24'}
                    ],
                    contacts:[]

                }
			]
		},
        {
            id: 'XXhX',
            timeContacted: 720,
            duration: 90,
			movement: [
                {time: 360, location: 'SISGSR31'},
                {time: 720, location: 'SISSR32'},
                {time: 1120, location: 'SISSR32'},
                {time: 2400, location: 'SISSR33'},
                {time: 2600, location: 'SOBSR23'}
            ],
            contacts: [
                {
                    id: 'XXdX',
                    timeContacted: 600,
                    movement: [
                        {time: 2000, location: 'SISSR21'},
                        {time: 2400, location: 'SISSR32'},
                        {time: 2600, location: 'SOESR24'}
                    ],
                },
                {
                    id: 'XX8X',
                    timeContacted: 800,
                    movement: [
                        {time: 2000, location: 'SISSR21'},
                        {time: 2400, location: 'SISSR32'},
                        {time: 2600, location: 'SOESR24'}
                    ],
                },
                {
                    id: 'XooXX',
                    timeContacted: 240,
                    contacts: [
                        {
                            id: 'XXdfsX',
                            timeContacted: 1500,
                            movement: [
                                {time: 2000, location: 'SISSR21'},
                                {time: 2400, location: 'SISSR32'},
                                {time: 2600, location: 'SOESR24'}
                            ],
                        },
                        {
                            id: 'XXXsf',
                            timeContacted: 1800,
                            movement: [
                                {time: 2000, location: 'SISSR21'},
                                {time: 2400, location: 'SISSR32'},
                                {time: 2600, location: 'SOESR24'}
                            ],
                        },
                        {
                            id: 'XhsXX',
                            timeContacted: 1600,
                            movement: [
                                {time: 2000, location: 'SISSR21'},
                                {time: 2400, location: 'SISSR32'},
                                {time: 2600, location: 'SOESR24'}
                            ],
                            contacts: [
                                {
                                    id: 'XXfjX',
                                    timeContacted: 1920,
                                    movement: [
                                        {time: 2000, location: 'SISSR21'},
                                        {time: 2400, location: 'SISSR32'},
                                        {time: 2600, location: 'SOESR24'}
                                    ],
                                },
                                {
                                    id: 'XerXX',
                                    timeContacted: 1900,
                                    movement: [
                                        {time: 2000, location: 'SISSR21'},
                                        {time: 2400, location: 'SISSR32'},
                                        {time: 2600, location: 'SOESR24'}
                                    ],
                                },
                                {
                                    id: 'XXX34f',
                                    timeContacted: 2800,
                                    movement: [
                                        {time: 2000, location: 'SISSR21'},
                                        {time: 2400, location: 'SISSR32'},
                                        {time: 2600, location: 'SOESR24'}
                                    ],
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]

};