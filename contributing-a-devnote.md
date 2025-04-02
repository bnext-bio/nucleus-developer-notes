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

# Installing the Curvenote Command line.

When writing your DevNote you can choose to work locally in either the `mystmd` CLI or the `curvenote` CLI tool. Both of these tools will allow you to run a local read and review your markdown changes in a web browser.

However, the Curvenote CLI is required in order to submit a draft and to fully preview your DevNote on the Nucleus DevNote website. However, if you're interested in installing `mystmd` follow the instructions at https://mystmd.org/guide/installing.

To install the If you have no CLI, you will first need to install Node.js on your system. You may already have this installed, so let's first check.

## Confirm node installation

In a terminal or command line prompt, run the following commands.

```sh
node -v
npm -v
```

Here you have Node version 18 or above and NPM version 9 or above available on your system. Here you have Node version 18 or above and NPM version 9 or above available on your system. If you don't have Node.js installed you can install it by following the instructions here: https://curvenote.com/docs/publish/installing-prerequisites.

## Install the Curvenote CLI

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

# Install text editor

We recommend installing [VSCode](https://code.visualstudio.com/download).

# Create a Github account and set up SSH

To contribute to our DevNotes, you'll need a GitHub account and SSH access configured. Here's how to get set up:

1. Create a GitHub account:

   - Visit [GitHub's signup page](https://github.com/signup)
   - Follow the prompts to create your account
   - We recommend using your work email address

2. Set up SSH authentication:
   - GitHub provides comprehensive guides for setting up SSH:
     - [Generating a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
     - [Adding your SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
   - Follow these guides to generate and add your SSH key
   - Test your SSH connection using [GitHub's SSH connection test](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection)

Once you have your GitHub account and SSH set up, you'll be ready to clone repositories and contribute to DevNotes.

# Install the GitHub CLI

While not required, we highly recommend installing the GitHub CLI (`gh`) as it makes many common GitHub operations much easier, including:

- Creating forks
- Pushing changes
- Opening pull requests
- Managing issues and pull requests

To install the GitHub CLI:

1. Visit the [GitHub CLI start page](https://cli.github.com/)
2. Follow the installation instructions for your platform
3. After installation, authenticate with your GitHub account:
   ```sh
   gh auth login
   ```
   Follow the interactive prompts to complete authentication

Once installed and authenticated, you can verify the installation by running:

```sh
gh --version
```

For more information about using the GitHub CLI, check out the [official documentation](https://cli.github.com/manual/).

# Clone the DevNotes repository

Our DevNotes repository can be found here: https://github.com/bnext-bio/nucleus-developer-notes, clone this entire repository to your machine.
The DevNote template can be found in the `dev-notes/00-template` folder. This template is preconfigured to render a DevNote, will let you test the configuration of tools on your system and will also form the base of your DevNote.

Let's start by testing the new tools and exploring the template.

# Rendering the DevNote Template

The DevNote source files themselves are a combination of Markdown and Jupyter Notebook files. To view them properly on the machine you need to run the Curvenote CLI which will open the rendered DevNote in your web browser. Let's do that now.

Firstly, navigate into the template folder.

```sh
cd dev-notes/00-template
```

Next run:

```sh
curvenote start
```

You'll see a lot of output on the terminal while the DevNote builds, and that should end by displaying a link like https://localhost:3000. Click on that link to open a browser window appear with a preview the DevNote template.

This is a live preview of the template and as long as you have `curvenote start` running in your Terminal, the preview will update as you editing and saving files via your text editor. This is really effective for a way to preview your changes whilst writing.

When you run `curvenote start`, your DevNote is displayed in the default layout and theme. Once you are further along in your writing, you can also submit a "draft" to the DevNotes site and preview it online. Draft submissions are only for you, can only be viewed with the link and can't be seen by anyone else or the DevNotes editors.

Let's go ahead and make a draft submission as that will also test that we can submit using our token. Run the command:

```sh
curvenote submit bnext-devnotes --draft
```

and follow the dialogue. At the end of the process you should see a link, click on that link to get to a preview of your DevNote online.

Congratulations! all the basic tools are in place to get started with your own DevNote.

# Exploring the DevNote Template

The template repository has been designed to have most of the common elements that we'd expect to see in a DevNote - we've made some decisions on content, layout, and style.

## Folder structure

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

## DevNote configuration

If we open and look inside our `curvenote.yml` file we will see a basic configuration like this:

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

You should not have to edit the majority of this page other than (1) creating a unique `id` and (2) adding basic metadata (title, subtitle, description, thumbnail,author; see docs at: https://mystmd.org/guide/frontmatter).

We _highly_ encourage developers to register themselves with [ORCID](https://orcid.org/) - this is a persistent identifier for individuals that links researchers with their research output.

## Use CDK (Workshop specific)

You will be able to access a Jupyter Hub instance at `jupyter.int.bnext.bio`. This will allow you to access an experimental directory template as well as all of the software tools contained in the CDK.

# Making the DevNote your own

Let's start by making a copy of the template repository, in a new folder inside the `dev-notes` folder (if you end up copying the ).

This will lead to something like this:

```
dev-notes/
  ├── 00-template
  ├── 01-another-devnote
  ├── ...
  ├── 2025-04-my-new-devnote
```

The folder name can be anything provided it's unique, we'd like to stick to something like `YEAR-MM-<relevant-title>` to keep things in order. Name your new folder appropriately.

## Create a unique id

The `id` specified in the `curvenote.yml` file is unique to your DevNote, e.g.

```sh
project:
  # Update this to match `nucleus-devnote-core-<folder>` the folder should be `???`
  id: nucleus-devnote-core-2025-04-my-first-devnote
```

Note: if your id is not unique, submission will fail.

# Writing your DevNote

## Understanding the template

DevNotes are a tool for sharing research insights that are roughly the scope of one scientific claim. For example, "methenyltetrahydrofolate synthetase is a critical but unacknowledged component in OnePot PURE"](https://nucleus.bnext.bio/developer-notes/an-unexpected-enzyme-in-pure-why-folinic-acid-needs-extra-help).

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

## MyST Essentials (targeted links to mystmd.org)

The DevNote is formatted using MyST markdown which is a simple but powerful flavor of markdown designed for scientific communication. There is a comprehensive [user guide for MyST Markdown](https://mystmd.org/guide) at https://mystmd.org/guide and for working with MyST to produce websites and web-based articles like a DevNote.

We suggest that you refer to that guide for anything you need regarding typography, writing, citing, formatting, cross-referencing and more. If you'd like to step back and learn more about MyST Markdown's features independent of the DevNote then try the quickstart guide for scientific articles here: https://mystmd.org/guide/quickstart-myst-documents

Otherwise, if you want to dive in we've shortlisted some key links that we think you'll need to get started on your DevNote:

- [Typography; for markdown basics](xref:mystmd/typography#headings)
- [Abstract and Parts](https://curvenote.com/docs/publish/authoring-in-myst#abstracts-and-parts)
- [Images](xref:mystmd/figures#simple-images), [Figures](xref:mystmd/figures#figure-directive) and [Videos](xref:mystmd/figures#videos)
- [Citations via DOI](xref:mystmd/citations#doi-links) or using [Bibtex](xref:mystmd/citations#including-bibtex) and [markdown citations](xref:mystmd/citations#table-pandoc-citations)
- [Cross Referencing](xref:mystmd/cross-references)

## Using Jupyter Notebooks

It's possible to include Jupyter Notebooks directly in your DevNote. A Jupyter Notebook will appear as a page in its own right within the DevNote. The notebook saved and submitted after execution is complete so that all outputs, images, text are also present in your DevNote.

There are various reasons why you might want to include Jupyter notebooks directly in your DevNote

- For instance, the actual results of executing them along with outputs produced are directly available and you don't have to copy or transcribe this information anywhere else.
- It's easier for you to iterate and update your dev note as you go.
- Others can download your notebooks directly from the DevNote.
- You can potentially add different types of interactive output, including Plotly, Bokeh and Altair plots.

By just including Jupyter Notebooks as part of your DevNote you allow them to be read directly on the web without anybody having to install Jupyter or download your notebook.

We call that Using the notebook passively, and even though the notebook is just passive, there's still a bunch of things you can do with them, including embedding notebook cells and their outputs in other pages, as well as wrapping these cross referenced figures or tables from individual outputs.

To learn more about using Jupyter Notebooks in that way, see the [Embed and Reuse Jupyter Outputs](https://mystmd.org/guide/reuse-jupyter-outputs) section in the MyST guide. You can also automatically run your notebooks when your DevNote builds on your local machine. To find out more about that, see [Execute Notebooks at Build Time](https://mystmd.org/guide/execute-notebooks).

### Enabling computation

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

# Publishing your DevNote

Once you've written your DevNote, the next step is to submit it to the editors of the Nucleus DevNote site.

This is done by opening a pull request on the DevNotes repository on GitHub.

We are going to assume that you are using the GitHub CLI and we'll go through those steps with you below. If you're not, please just check the GitHub documentation on how to create a fork (https://docs.github.com/en/get-started/quickstart/fork-a-repo) and how to open a PR against an upstream repo (https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

## Checking your draft

The submission system includes a check suite which allows the DevNotes editors to run up some automated checks on your submission. These checks can be for, things like whether you've added an abstract, the abstract length, or whether all your authors have ORCIDs and whether the DOIs that you're using are valid.

These will be automatically checked when you submit your work and you'll still have chances to correct those afterwards but you can get a head start and check your draft in advance by running the following command.

```sh
curvenote check bnext-devnotes --kind=dev-notes
```

And look for potential issues both in the build process and in the Curvenote Checks section.

## Previewing your first draft

If you haven't already, you should go ahead and check a draft of your DevNote as a preview on the DevNote site. You can do this by running the following command.

```sh
cn submit bnext-devnotes --draft
```

Check that you are happy with your DevNote in the preview and if not, continue to make changes locally until you are. You can make as many draft submissions as you need to.

Once you're ready we'll carry on and submit your DevNote proper by opening a PR.

## Submitting your DevNote

We're going to submit your DevNote now via a PR and by creating your own fork.

:::{tip} How to provide a good title and description for my PR

This PR is your first interaction with the editorial and review team at the Nucleus Dev Notes site. Please set your title to the title of your DevNote and provide a bit of a introduction your DevNote to the editors and reviewers. If you don't manage to get this in place when you first create the PR, don't worry, you can edit it any time on GitHub.

:::

By now, you will have cloned the repo and made your own folder in the `dev-notes/*` folder, where you've been working so far.

It's important to make sure that any changes that you've made in the repo are only to the contents of your new folder, and nowhere outside of that folder. You can check this by running `git status` and making sure all changes or additions are only in your DevNote folder. If you have changes outside you'll need to revert them before submitting.

Once that's the case then go ahead and just locally commit your changes to the main branch:

```sh
git add .
git commit -am "my commit message"
```

Next we're going to use the GitHub CLI to open a PR and in the process create our own fork of the DevNotes repo in our account. To do this, just run the following command from anywhere within the repository and follow the instructions:

```sh
gh pr create
```

The GitHub CLI will take you through the process of deciding to create a fork, creating the fork in your own account, pushing your changes to your fork and then opening the PR.

At the end of the process, a link to your PR should be displayed, click that link to visit the PR on the central DevNotes repository.

:::{tip} If you are not using the GitHub CLI
:class: dropdown
Please check the GitHub documentation on how to create a fork (https://docs.github.com/en/get-started/quickstart/fork-a-repo) and how to open a PR against an upstream repo (https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).
:::

Once you've landed on the pull request page on GitHub and you're happy with the title and initial description look for a comment from the Curvenote preview bot it should look something like this.

:::{figure} ./github-submit-bot.png
The Curvenote Preview bot on GitHub.
:::

The comment from the Curvenote Bot should appear shortly after you've posted your PR and every time you push a new change to your branch, the PR will automatically update and the Curvenote Preview will automatically regenerate, this will including re-running any checks that have been configured to run.

## Requesting review

The review process is carried out over GitHub and the exact same PR that you just opened. Yourself, the editors and reviewers can all see the source code and access the preview links from the Cursor bot in order to guide the review and you may have already been contacted by one of the team when you opened the PR.

If you haven't just mention `@antonrmolina` in a comment and say this is ready for review.

## Updating your article (new docs)

Keep making changes to your DevNote locally, in response to reviewer comments and push these to your fork, the PR and preview will automatically update.

## Getting Published

Once the review is complete and the editorial team is happy, the PR will be merged and then separately the publication, the editors will allow your DevNote to be posted live on the Nucleus DevNotes website.

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
