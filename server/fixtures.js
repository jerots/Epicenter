
if (Virology.find().count() == 0) {
    var viruses = [
        {
            name: 'MERS',
            minIncubation: 5,
            maxIncubation: 14,
            infectivityBeforeSymptoms: 0,
            transmission: 'Contact Precaution'
        },
        {
            name: 'SARS',
            minIncubation: 2,
            maxIncubation: 10,
            infectivityBeforeSymptoms: 0,
            transmission: 'Droplet precaution'
        },
        {
            name: 'EBOLA',
            minIncubation: 2,
            maxIncubation: 21,
            infectivityBeforeSymptoms: 0,
            transmission: 'Contact Precaution'
        },
        {
            name: 'H1N1',
            minIncubation: 1,
            maxIncubation: 4,
            infectivityBeforeSymptoms: 1,
            transmission: 'Contact Precaution'
        },
        {
            name: 'HFMD',
            minIncubation: 2,
            maxIncubation: 14,
            infectivityBeforeSymptoms: 1,
            transmission: 'Contact Precaution'
        },
        {
            name: 'CHICKENPOX',
            minIncubation: 10,
            maxIncubation: 21,
            infectivityBeforeSymptoms: 1,
            transmission: 'Contact Precaution'
        },

    ];

    _.each(viruses, function (virus) {
        Virology.insert({
            name: virus.name,
            minIncubation: virus.minIncubation,
            maxIncubation: virus.maxIncubation,
            infectivityBeforeSymptoms: virus.infectivityBeforeSymptoms,
            transmission: virus.transmission
        });
    })
}