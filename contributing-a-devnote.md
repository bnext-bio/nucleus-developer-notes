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

## Installing the Curvenote Command line.

When writing your DevNote you can choose to work locally in either the `mystmd` CLI or the `curvenote` CLI tool. Both of these tools will allow you to run a local read and review your markdown changes in a web browser.

However, the Curvenote CLI is required in order to submit a draft and to fully preview your DevNote on the Nucleus DevNote website. However, if you're interested in installing `mystmd` follow the instructions at https://mystmd.org/guide/installing.

To install the If you have no CLI, you will first need to install Node.js on your system. You may already have this installed, so let's first check.

### Confirm node installation

In a terminal or command line prompt, run the following commands.

```sh
node -v
npm -v
```

Here you have Node version 18 or above and NPM version 9 or above available on your system. Here you have Node version 18 or above and NPM version 9 or above available on your system. If you don't have Node.js installed you can install it by following the instructions here: https://curvenote.com/docs/publish/installing-prerequisites.

### Install the curvenote CLI

Once you've ensured that you have node.js available, you can install the Curvenote CLI using the Node Package Manager, npm. To do that, run the following command ensuring that you include the `-g` flag as shown.

```sh
npm install -g curvenote@latest
```

Confirm the installation by running the following code:

```sh
curvenote -v
```

## Getting your API token

In order to fully use the Curvenote CLI and to preview and submit your DevNote you will need to create an API Token and register that with the Curvenote CLI on your machine.

To generate your token, follow the instructions here: https://curvenote.com/docs/publish/authentication

You can confirm and check the validity of your API token at any time by running the following command on your machine:

```sh
curvenote token check
```

Which, for a valid token, will display something like this

```sh
Active token:
"Steve Purves" <amolina@bnextbio.com> at https://api.curvenote.com/login
Expiry: no expiry
Token status: VERIFIED
Login as @stevejpurves <amolima@bnextbio.com> verified by https://sites.curvenote.com/v1/my/user
```

## Install text editor

We recommend installing [VSCode](https://code.visualstudio.com/download).

## Create a Github account and set up SSH

## Clone the DevNote template repository

STEVE: I suggest we orient this back around the devnotes central repo, copying your template into place there?

Our Devnote template can be found [here](https://github.com/antonrmolina/devnote-template). This template is preconfigured to render a Devnote and will test the installation of other tools.

- Use the CLI tool to navigate to the repository
- Run the command `curvenote start` and wait for a link to be shown
- Click on the link and you should expect to see a window that will allow you to view a local preview of the Devnote
- Run the command `curvenote submit bnext-devnotes --draft` and follow the dialogue
- Click on thar link, and you should expect to see a preview of the Devnote on the BNext DevNotes site

Congratulations all the basic tools are in place to get started with your own devnote

## Making the DevNote your own

### Folder structure

If you are using a text editor, for example VSCode, open up the folder to explore the files:

```
00-Template/
  ├── _build
  ├── experiment-01
  │   ├── design/..
  |   ├── data/..
      ├── analysis/..
      ├── output/..
  │   └── general/..

  ├── figures
      └── schematic-01.png
  ├── src
  ├── .gitignore
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

You should not have to edit this page other than adding author information as appropriate. We _highly_ encourage developers to register themselves with [ORCID](https://orcid.org/) - this is a persistent identifier for individuals that links researchers with their research output.

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

The DevNote is formatted using MyST markdown which is a simple but powerful flavor of markdown designed for scientific communication. There is a comprehensive [user guide for MyST Markdown](https://mystmd.org/guide) at https://mystmd.org/guide and for working with MyST to produce websites and web-based articles like a DevNote.

We suggest that you refer to that guide for anything you need regarding typography, writing, citing, formatting, cross-referencing and more. If you'd like to step back and learn more about MyST Markdown's features independent of the DevNote then try the quickstart guide for scientific articles here: https://mystmd.org/guide/quickstart-myst-documents

Otherwise, if you want to dive in we've shortlisted some key links that we think you'll need to get started on your DevNote:

- [Typography; for markdown basics](xref:mystmd/typography#headings)
- [Abstract and Parts](https://curvenote.com/docs/publish/authoring-in-myst#abstracts-and-parts)
- [Images](xref:mystmd/figures#simple-images), [Figures](xref:mystmd/figures#figure-directive) and [Videos](xref:mystmd/figures#videos)
- [Citations via DOI](xref:mystmd/citations#doi-links) or using [Bibtex](xref:mystmd/citations#including-bibtex) and [markdown citations](xref:mystmd/citations#table-pandoc-citations)
- [Cross Referencing](xref:mystmd/cross-references)

### Using Jupyter Notebooks

It's possible to include Jupyter Notebooks directly in your DevNote. A Jupyter Notebook will appear as a page in its own right within the DevNote. The notebook saved and submitted after execution is complete so that all outputs, images, text are also present in your DevNote.

There are various reasons why you might want to include Jupyter notebooks directly in your DevNote

- For instance, the actual results of executing them along with outputs produced are directly available and you don't have to copy or transcribe this information anywhere else.
- It's easier for you to iterate and update your dev note as you go.
- Others can download your notebooks directly from the DevNote.
- You can potentially add different types of interactive output, including Plotly, Bokeh and Altair plots.

By just including Jupyter Notebooks as part of your DevNote you allow them to be read directly on the web without anybody having to install Jupyter or download your notebook.

We call that Using the notebook passively, and even though the notebook is just passive, there's still a bunch of things you can do with them, including embedding notebook cells and their outputs in other pages, as well as wrapping these cross referenced figures or tables from individual outputs.

To learn more about using Jupyter Notebooks in that way, see the [Embed and Reuse Jupyter Outputs](https://mystmd.org/guide/reuse-jupyter-outputs) section in the MyST guide. You can also automatically run your notebooks when your DevNote builds on your local machine. To find out more about that, see [Execute Notebooks at Build Time](https://mystmd.org/guide/execute-notebooks).

#### Enabling computation

With a little bit more work to manage your Python dependency environment, you can enable computation for the readers of your DevNote. With a little bit more work to manage your Python dependency environment, you can enable computation for the readers of your DevNote. Building on Python Development Best Practices for Creating and Managing Virtual Environments

You can specify a reproducible environment specification that will be shipped with your DevNote when you submit it. Building on Python Development Best Practices for Creating and Managing Virtual Environments

You can specify a reproducible environment specification that will be shipped with your DevNote when you submit it. This follows the standards set out by the Project Jupyter teams such that any Python environment that works on the https://mybinder.org site should also work here within your DevNote.

The DevNote template is already set up to expect a conda-based environment. You can see that from the entry in your `curvenote.yml` file as shown below.

```yaml
project:
  jupyter: true
  exports:
    - format: meca
  requirements:
    - environment.yml
```

The first two settings, `jupyter: true` and `format: meca` should not be changed Unless you intend to disable computation within your article. In which case you can set `jupyter: false`. If you are using pip instead of `conda`, you can replace the `environment.yml` directly with `requirements.txt`. If you have additional setup requirements, a lot is possible. For more information [see this link](https://curvenote.com/docs/publish/live-compute) and read more about what is possible using [REES configuration files](https://repo2docker.readthedocs.io/en/latest/config_files.html).

Once you've correctly configured your environment, a MECA Archive will be built which will enable you to both launch a JupyterHub server directly from your DevNote and to run any in-place notebook cells or embedded figures or tables directly from the pages of your DevNote.

## Publishing your DevNote

### Submitting your first draft (new docs)

TODO:

1.  previewing (existing / new docs?)
1.  the checks system (existing / new docs?)
1.  troubleshooting (existing / new docs?)

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
