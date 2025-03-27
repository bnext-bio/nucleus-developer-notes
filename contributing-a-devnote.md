---
title: Contributing your first dev note
short_title: Contributing
---

Are you interested in publishing a Nucleus Community DevNote? If so, the following Guide has been put together for you. It will take you through creating a DevNote step-by-step - from forking our repo and copying our template folder through to reviewing your dev note online and submitting it for review and publication.

# What is a DevNote?

DevNotes are articles from our community that are published here on the Nucleus dev notes site. Articles can be a formal, informal, blog post style, long form or short form but the tools that we use and you will have access to here will allow you to write a technical article It will be published online and can include figures, data, tables, captions, citations, and all of the usual things you'd expect from an online scientific publication.

# What format do you use?

DevNotes are written in a format called MyST Markdown. To learn more about MyST visit https://mystmd.org where you can find guides on to use and get the most out of MyST for scientific and technical writing. So you'll be primarily writing in a Markdown files but you can also directly include Jupyter notebooks, either text based `.md` notebooks or in `.ipynb` format. You could either use a markdown file or a Jupyter notebook for the main page of your article. Or you could include one or more Jupyter notebooks to produce figures, plots, or provide supporting material and embed parts of them within your article.

A lot is possible, and there's a lot of flexibility. So we've created a template to get you started on creating an article with the style that we'd like to see in our DevNotes.

# What will I need?

When writing your dev note, you're going to be working locally on your computer, so you'll need your favorite text editor or IDE - we recommend [VSCode](https://code.visualstudio.com/download). You'll also be working with Git and interacting with GitHub to complete the submission and review workflows.
If you're going to work with Jupyter notebooks and include those in your DevNote Then you'll also need to build and manage your own reproducible Python environment locally, which you'll also publish alongside your DevNote. For now, we only recommend that route for people who are already using Jupyter notebooks on a day-to-day basis and who are familiar with issues around maintaining a reproducible environment.
# Let's get started

The remainder of this document is going to take you through getting started and submitting your first DevNote. There are links out to resources online that will help you complete tasks or provide useful context information.

## Installing the Curvenote Command line. Using conda. Using pip. Using npm. (have links)

NOTE: I really like the way this was introduced in the Myst MD quickstart tutorial where it presents a sane default for "not sure" and then uses tabs for different options. I think that conda will probably be the most familiar option for many.

:::{admonition} My custom title with *Markdown*!
:class: tip
The easiest way to install MyST is with the mamba package manager. mamba is a cross-platform language-agnostic package manager that is useful for users across many data science languages like Python, R, Julia, and JavaScript.
:::

## Install text editor

We recommend installing [VSCode](https://code.visualstudio.com/download).

## Create a Github account and set up SSH

## Clone the DevNote template repository

Our Devnote template can be found [here](https://github.com/antonrmolina/devnote-template). This template is preconfigured to render a Devnote and will test the installation of other tools. 

- Use the CLI tool to navigate to the repository
- run the command `curvenote submit bnext-devnotes --draft` and follow the dialogue
- You should expect to see a window that will allow you to view a preview of the Devnote

Congratulations all the basic tools are in place to get started with your own devnote

## Making the DevNote your own

### Folder structure

If you are using a text editor, for example VSCode, open up the folder to explore the files:

```
00-Template/
  ├── _build
  ├── experiment-01
  │   ├── design/..
|     ├── data/..
      ├── analysis/..
      ├── output/..
  │   └── general/..

  ├── figures
      └── schematic-01.png
  ├── src
  ├── curvenote.yml
  ├── environment.yml
  └── main.md
```

A brief explanation for each component of this file structure:

- `_build` contains files that help Curvenote render this directory into HTML that can be viewed on the web.
- `experiment-01` contains files that correspond to steps along the research lifecycle and integrate with tools from the cell development kit.
   - `design` contains files related to experimental design such as platemaps and genbank files.
   - `data` stores experimental data, for example a time series obtained from a fluorescent plate reader.
   - `analysis` contains files used to analyze the data such a jupyter notebooks.
   - `output` contains results from analysis that you might want to share with others or reference in your DevNote.
   - `general` contains experimental metadata such as protocols, research notebooks, or device information.
- `figures` contains figures that you might want to reference in your Devnote that are not immediately derived from experimental data such as schematics
- `src` provides a place for local source code.
- `curvenote.yml` configures the DevNote with author information, title, etc.
- `environment.yml` provides a place to specify which software dependencies are required to perform the analysis workflow.
- `main.md` is the file corresponding to your DevNote and may also be a `.ipynb`.

As you go about your research, you can drop additional experimental directories that are worth sharing with the community as needed and reference them in your main.md

### DevNote configuration

If we open and look inside our curvenote.yml we will see a basic configuration like this:

```
# See docs at: https://mystmd.org/guide/frontmatter
version: 1
project:
  # Update this to match `nucleus-devnote-core-<folder>` the folder should be `???`
  id: nucleus-devnote-core-00_myst_template
  # Ensure your title is the same as in your `main.md`
  title: An Unexpected Enzyme in PURE Why Folinic Acid Needs Extra Help 
  subtitle: An Unexpected Enzyme in PURE Why Folinic Acid Needs Extra Help 
  description: An Unexpected Enzyme in PURE Why Folinic Acid Needs Extra Help 
  # Authors should have affiliations, emails and ORCIDs if available
  authors:
    - name: Yemo Ku
      email: yemo@bnext.bio
      orcid: 0000-0000-0000-0001
      affiliations:
        - b.next
      corresponding: true
```

You should not have to edit this page other than adding author information as appropriate. We *highly* encourage developers to register themselves with [ORCID](https://orcid.org/) - this is a persistant identifier for individuals that links researchers with their research output. 

## Use CDK (Workshop specific)

You will be able to access a Jupyter Hub instance at `jupyter.int.bnext.bio`. This will allow you to access an experimental directory template as well as all of the software tools contained in the CDK. 

## Writing your DevNote

### Understanding the template

DevNotes are a tool for sharing research insights that are roughly the scope of one scientific claim. For example, “[methenyltetrahydrofolate synthetase is a critical but unacknowledged component in OnePot PURE”](https://nucleus.bnext.bio/developer-notes/an-unexpected-enzyme-in-pure-why-folinic-acid-needs-extra-help).

At this point, the structure of a DevNote is quite simple and flexible. It has the following components:

- Title: what is the claim supported by this experiment
- Abstract: a brief description of the question and answer
- Body: describe background and experimental results in a way that feel appropriate
- Future directions: what comes next?

For now, experimental details are stored in the directory `./experimental/general/notebook.pdf` and can be accessed from the DevNote itself by modifying the configuration file:

```
  resources:
    - src/**/*
    - experimental/**/*
    - figures/**/*
  downloads:
    - file: experimental/MTHFS-labnotebook.pdf
      title: Lab Notebook Entry
```

### MyST Essentials (targeted links to mystmd.org)

The DevNote is formatted using MyST markdown which is a simple but powerful flavor of markdown designed for scientific communication. 

TODO: (targeted links to mystmd.org)

### Using Jupyter Notebooks

   1. passively
      1. links to mystmd.org for jupyter, local execution, embedding, outputs and figures, tables.
   1. with computation (reproducible environment)
      1. Explain what is possible, building a reproducible environment (links to docs+mystmd+REES)

## Publishing your DevNote

### Submitting your first draft (new docs)

TODO:

   1. previewing (existing / new docs?)
   1. the checks system (existing / new docs?)
   1. troubleshooting (existing / new docs?)

### Requesting review (new docs)

TODO

### Updating your article (new docs)

TODO

## Other resources

::::{tip} Other Resources - the SciPy Proceedings Submissions
:class: dropdown
We use the same submission system as the SciPy Conference Proceedings does, including a similar layout within our GitHub repository. Below is a webinar recording introducing the SciPy 2024 submission process and although it's not exactly the same as our DevNote workflow, it's close and is worth watching for background
context.
:::{iframe} https://www.youtube.com/embed/v97nJOCAWHI
:::
::::

# Old outline

1. Install VS Code
1. finding our repository.
1. creating your fork (existing / new docs?)
1. template folder (existing / new docs?)
1. Use CDK
   1. Log in to our local jupyter hub
   1. Run code in example experimental directory
   1. save notebooks locally?
1. Copying the template and starting your article (existing / new docs?)
1. Writing your article (no Jupyter)
   1. understanding the template (existing / new docs?)
   1. MyST Essentials (targeted links to mystmd.org)
1. Using Jupyter Notebooks
   1. passively
      1. links to mystmd.org for jupyter, local execution, embedding, outputs and figures, tables.
   1. with computation (reproducible environment)
      1. Explain what is possible, building a reproducible environment (links to docs+mystmd+REES)

