---
title: Contributing your first dev note
short_title: Contributing
---

Are you interested in publishing a Nucleus Community DevNote? If so, the following Guide has been put together for you. It will take you through creating a DevNote step-by-step - from forking our repo and copying our template folder through to reviewing your dev note online and submitting it for review and publication.

# What is a DevNote?

DevNotes are articles from our community that are published here on the Nucleus dev notes site. Articles can be a formal, informal, blog post style, long form or short form but the tools that we use and you will have access to here will allow you to write a technical article It will be published online and can include figures, data, tables, captions, citations, and all of the usual things you'd expect from an online scientific publication.

# What format do you use?

DevNotes are written in a format called MyST Markdown. To learn more about MyST visit https://mystmd.org where you can find guides on to use and get the most out of MyST for scientific and technical writing. So you'll be primarily writing in a Markdown files but you can also directly include Jupyter notebooks, either test based `.md` notebooks or in `.ipynb` format. You could use a Jupyter notebook for the main page of your article. Or you could include one or more Jupyter notebooks to produce figures, plots, or provide supporting material and embed parts of them within your article.

A lot is possible, and there's a lot of flexibility. So we've created a template to get you started on creating an article with the style that we'd like to see in our DevNotes.

# What will I need?

When writing your dev note, you're going to be working locally on your computer, so you'll need your favorite text editor or IDE. You'll also be working with Git and interacting with GitHub to complete the submission and review workflows.

If you're going to work with Jupyter notebooks and include those in your DevNote Then you'll also need to build and manage your own reproducible Python environment locally, which you'll also publish alongside your DevNote. For now, we only recommend that route for people who are already using Jupyter notebooks on a day-to-day basis and who are familiar with issues around maintaining a reproducible environment.

# Let's get started

The remainder of this document is going to take you through getting started and submitting your first DevNote. There are links out to resources online that will help you complete tasks or provide useful context information.

1. Installing the Curvenote Command line. Using conda. Using pip. Using npm. (have links)
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
1. Submitting your first draft (existing / new docs?)
   1. previewing (existing / new docs?)
   1. the checks system (existing / new docs?)
   1. troubleshooting (existing / new docs?)
1. Requesting review (existing / new docs?)
1. Updating your article (existing / new docs?)

::::{tip} Other Resources - the SciPy Proceedings Submissions
:class: dropdown

We use the same submission system as the SciPy Conference Proceedings does, including a similar layout within our GitHub repository. Below is a webinar recording introducing the SciPy 2024 submission process and although it's not exactly the same as our DevNote workflow, it's close and is worth watching for background
context.

:::{iframe} https://www.youtube.com/embed/v97nJOCAWHI
:::

::::
