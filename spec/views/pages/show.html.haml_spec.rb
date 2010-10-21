require 'spec_helper'

describe "pages/show.html.haml" do
  before(:each) do
    @page = assign(:page, stub_model(Page,
      :title => "Title",
      :body => "MyText",
      :stylesheet => "MyText"
    ))
  end

  it "renders attributes in <p>" do
    render
    rendered.should contain("Title".to_s)
    rendered.should contain("MyText".to_s)
    rendered.should contain("MyText".to_s)
  end
end
