import React, { Component } from "react";
import NewsItem from "./NewsItem";
import LoadImogi from "./LoadImogi";
import PropTypes from "prop-types";
export class News extends Component {
  static defaultProps = {
    country: "us",
    pageSize: 3,
    category: "general",
  };
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
  capitalizefirstletter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
    document.title = `${this.capitalizefirstletter(
      this.props.category
    )}-NewsMonkey`;
  }
  async componentDidMount() {
    this.updatePage();
  }
  updatePage = async () => {
    this.props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=2931b96ab97743ab97aaa6bbb999cb9a&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.props.setProgress(50);
    console.log(parsedData);
    this.setState({
      articles: parsedData.articles,
      loading: false,
    });
    this.props.setProgress(100);
  };

  handlenextclick = async () => {
    if (
      !(
        this.state.page + 1 >
        Math.ceil(this.state.totalResults / this.props.pageSize)
      )
    ) {
      await this.setState({ page: this.state.page + 1 });
      this.updatePage();
    }
  };

  handleprevclick = async () => {
    await this.setState({ page: this.state.page - 1 });
    this.updatePage();
  };

  fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey="2931b96ab97743ab97aaa6bbb999cb9a"&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    //console.log(parsedData);
    this.setState({
      articles: parsedData.articles,
      loading: false,
    });
  };

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center" style={{ marginTop: "90px" }}>
          <div className="my-4">
            NewsMonkey-{this.capitalizefirstletter(this.props.category)} Top
            Headlines
          </div>
        </h1>
        {this.state.loading && <LoadImogi />}

        <div className="row">
          {this.state.articles &&
            this.state.articles.map((element) => {
              return (
                <div className="col md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 45) : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 88)
                        : ""
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author ? element.author : "Unknown"}
                    publishedAt={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
        </div>

        <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handleprevclick}
          >
            Previous &larr;{" "}
          </button>
          <button
            disabled={
              this.state.page + 1 >
              this.state.totalResults / this.props.pageSize
            }
            type="button"
            className="btn btn-dark"
            onClick={this.handlenextclick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
