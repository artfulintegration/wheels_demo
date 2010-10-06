class InsertAdminUserAndRoles < ActiveRecord::Migration
  def self.up
    Role.create(:name=>"Super")
    Role.create(:name=>"Admin")
    Role.create(:name=>"User")
    Role.create(:name=>"Nobody")
    user = User.create(:email=>"tgannon@gmail.com",
                :password=>"sourdough",
                :confirmed_at=>DateTime::now,
                :role=>:super,
                :profile_attributes => {
      :first_name => "Tyler",
      :last_name => "Gannon",
      :blog_title => "Tyler's Blog",
      :alias => "tyler",
      :phone => ""
      })
  end

  def self.down
    User.find_by_email("tgannon@gmail.com").destroy
    Role.all.each {|t| t.destroy}
  end
end

