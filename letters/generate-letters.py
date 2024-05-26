import subprocess
import os

schools = [
    ['brown', 'a note'],
    ['blue', 'a note'],
    ['purple', 'a note']
]

# Read the main file
with open('../tex/template.tex', 'r', encoding='utf-8') as file:
    mainfile = file.read()

# Read the template part
with open('../tex/sameforall.tex', 'r', encoding='utf-8') as file:
    sampleforallFile = file.read()

for school in schools:
    # Read the school configuration file
    parameter_file = '../school-customization/' + school[0] + '.tex'
    with open(parameter_file, 'r', encoding='utf-8') as file:
        parameters = file.read()

    # Decode the configuration file
    schoolinfo = [line for line in parameters.split('%---') if line != '']

    next_file = mainfile[:]
    # Add the text color command
    curr_all = next_file.replace('\\input{../tex/sameforall.tex}', sampleforallFile)

    # Look into each school
    for entry in schoolinfo:
        entry_lines = entry.strip().split('\n')
        if len(entry_lines) > 1:
            content = entry_lines[1].strip()
            # Replace the template file with the info in the configuration file
            curr_all = curr_all.replace(entry_lines[0], content)

    # Output the school tex
    name = school[0].upper()
    tex_file = name + '-letter.tex'
    pdf_file = name + '-letter.pdf'

    with open(tex_file, 'w', encoding='utf-8') as file:
        file.write(curr_all)
    print(school)

    # Compile the school text into PDF
    try:
        subprocess.run(f'xelatex --output-directory=tmps {tex_file}', check=True, shell=True, text=True)
        # Move the PDF into another folder
        subprocess.run(f'mv tmps/{pdf_file} pdfs/{pdf_file}', check=True, shell=True, text=True)
    except subprocess.CalledProcessError as e:
        print(f'An error occurred: {e}')
    else:
        print('Total:', len(schools))
