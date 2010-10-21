require 'spec_helper'

describe "pages/edit.html.haml" do
  before(:each) do
    @page = assign(:page, stub_model(Page,
      :new_record? => false,
      :title => "MyString",
      :body => "MyText",
      :stylesheet => "MyText"
    ))
  end

  it "renders the edit page form" do
    render

    rendered.should have_selector("form", :action => page_path(@page), :method => "post") do |form|
      form.should have_selector("input#page_title", :name => "page[title]")
      form.should have_selector("textarea#page_body", :name => "page[body]")
      form.should have_selector("textarea#page_stylesheet", :name => "page[stylesheet]")
    end
  end
end
