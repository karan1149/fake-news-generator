Fake News Generator
===

Uses Tensorflow RNN to generate fake news articles by modeling scraped language.

Inspired from Andrej Karpathy's [char-rnn](http://karpathy.github.io/2015/05/21/rnn-effectiveness/).

## Requirements
- [Tensorflow 1.0](http://www.tensorflow.org)

## Basic Usage
Run `python train.py`. To access all the parameters use `python train.py --help`.

To sample from a checkpointed model, `python sample.py`.

## Tensorboard
To visualize training progress, model graphs, and internal state histograms:  fire up Tensorboard and point it at your `log_dir`.  E.g.:
```bash
$ tensorboard --logdir=./logs/
```

Then open a browser to [http://localhost:6006](http://localhost:6006) or the correct IP/Port specified.

