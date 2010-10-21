require 'spec_helper'

describe "pages/index.html.haml" do
  before(:each) do
    assign(:pages, [
      stub_model(Page,
        :title => "Title",
        :body => "MyText",
        :stylesheet => "MyText"
      ),
      stub_model(Page,
        :title => "Title",
        :body => "MyText",
        :stylesheet => "MyText"
      )
    ])
  end

  it "renders a list of pages" do
    render
    rendered.should have_selector("tr>td", :content => "Title".to_s, :count => 2)
    rendered.should have_selector("tr>td", :content => "MyText".to_s, :count => 2)
    rendered.should have_selector("tr>td", :content => "MyText".to_s, :count => 2)
  end
end
