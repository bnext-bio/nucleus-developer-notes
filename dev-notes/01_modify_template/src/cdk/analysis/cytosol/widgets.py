from src.cdk.analysis.cytosol import platereader as pr
import pandas as pd

import seaborn as sns
import seaborn.objects as so

import matplotlib.pyplot as plt
import ipywidgets as widgets

import src.cdk.logging

def interactive_curve_by_experiment(my_data, toggle_col='Experiment', display_by='Name'):

    def sns_plot_experiment(experiment):

        plt.clf()

        experiment_data = my_data[my_data[toggle_col] == experiment]

        for row, group in experiment_data.groupby(display_by):
            sns.lineplot(x='Seconds', y='Data', data=group, label=row)

        plt.show()

    # Create widgets for the parameters
    toggle = widgets.ToggleButtons(
        options=my_data[toggle_col].unique().tolist(),
        description=toggle_col+":",
        disabled=False,
        button_style=''
    )

    # Use interact to link the widgets to the plotting function
    my_widget = widgets.interact(sns_plot_experiment, experiment=toggle)