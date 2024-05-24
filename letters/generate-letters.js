
const fs = require('fs');
const exec = require('child_process').exec;

const schools = [
    ['brown', 'a note'],
    ['blue', 'a note'],
    ['purple', 'a note']
]
// read the main file
const mainfile = fs.readFileSync('../tex/template.tex', 'utf8');
// read the template part
const sampleforallFile = fs.readFileSync('../tex/sameforall.tex', 'utf8');


schools.forEach((school, index) => {

    // read the school configuration file
    let parameterFile = '../school-customization/' + school[0] + '.tex'
    let parameters = fs.readFileSync(parameterFile, 'utf8');

    // decode the configuration file
    let schoolinfo = parameters.split('%---').filter(l => l != '')
    
    let nextFile = JSON.parse(JSON.stringify(mainfile));

    // add the text color command
    currAll = nextFile.replace('\\input{../tex/sameforall.tex}', sampleforallFile)

    // look into each school
    schoolinfo.forEach(entry => {
        let entryLines = entry.trim().split('\n')

        if (entryLines.length > 1) {
            // console.log(entryLines)

            let content = entryLines[1].trim()

            // replace the template file with the info in the configuration file
            currAll = currAll.replace(entryLines[0], content)


        }
    })

    // output the school tex
    let name = school[0].toUpperCase()
    let tex_file = name + '-letter.tex'
    let pdf_file = name + '-letter.pdf'

    fs.writeFile(tex_file, currAll, () => { console.log(school) })


    // compile the school text into PDF
    exec('xelatex --output-directory=tmps ' + tex_file,
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            } else {
                // move the PDF into another folder
                exec('mv tmps/' + pdf_file + ' pdfs/' + pdf_file,
                    function (error, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        if (error !== null) {
                            console.log('exec error: ' + error);
                        } else {
                            console.log('total : ' + schools.length)
                        }
                    });
            }
        });

})








