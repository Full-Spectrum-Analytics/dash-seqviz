import json
from pathlib import Path
from setuptools import setup

here = Path(__file__).parent
with open('package.json') as f:
    package = json.load(f)
long_description = (here / 'README.md').read_text()

package_name = package["name"].replace(" ", "_").replace("-", "_")

setup(
    name=package_name,
    version=package["version"],
    author=package['author'],
    url='https://dash-seqviz.com',
    project_urls={
        'Source': 'https://github.com/Full-Spectrum-Analytics/dash-seqviz',
        'Bug Tracker': 'https://github.com/Full-Spectrum-Analytics/dash-seqviz/issues',
        'Documentation': 'https://dash-seqviz.com',
    },
    packages=[package_name],
    include_package_data=True,
    license=package['license'],
    description=package.get('description', package_name),
    long_description=long_description,
    long_description_content_type="text/markdown",
    install_requires=['dash>=3.0.0'],
    python_requires='>=3.9',
    keywords=(
        'dash plotly dash-component react-component seqviz '
        'dna rna protein sequence-visualization bioinformatics '
        'synthetic-biology plasmid'
    ),
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Framework :: Dash',
        'Intended Audience :: Science/Research',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3 :: Only',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
        'Programming Language :: Python :: 3.12',
        'Programming Language :: Python :: 3.13',
        'Topic :: Scientific/Engineering :: Bio-Informatics',
        'Topic :: Scientific/Engineering :: Visualization',
    ],
)
