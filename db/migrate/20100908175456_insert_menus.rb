class InsertMenus < ActiveRecord::Migration
  def self.up
    root = Sitemap.create(:menu_text=>'root', :position=>0, 
                          :resource=>Menu.create(:title=>'root'))
    Sitemap.create(:menu_text=>'Main Menu', :position=>0, :parent=>root, :resource=>Menu.create(:title=>'Main Menu'))
    Sitemap.create(:menu_text=>'Settings', :position=>1, :parent=>root, :resource=>Menu.create(:title=>'Settings'))
    Sitemap.create(:menu_text=>'Lost + Found', :position=>2, :parent=>root, :resource=>Menu.create(:title=>'Lost And Found'))

  end

  def self.down
  end
end

