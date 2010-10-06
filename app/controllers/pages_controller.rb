class PagesController < InheritedResources::Base
  respond_to :js, :html
  ajax_loading
  before_filter :authenticate_user!, :except=>[:show]
  before_filter :authorize_resource, :except=>[:index, :show]

  has_scope :tagged_with, :as => :tag

  has_scope :accessible_by, :type=>:boolean, :default=>true do |c,s|
    s.accessible_by(c.current_ability)
  end

  def show
    @sidebar = true
    if params[:id]
      @sitemap ||= resource.sitemaps.sort{|t,u| t.url.size <=> u.url.size}[0]
      @page = resource
    else
      @sitemap = Sitemap.from_request_params(params)
      @page = @sitemap.try(:resource)
    end
    if @page
      @child_pages = Sitemap.accessible_by(current_ability).where(:parent_id=>@sitemap.id)

      if can_access_resources?
        respond_with @page, @sitemap, @child_pages, @attachments
      else
        if user_signed_in?
          flash[:notice] = "How did you find that page?  Please contact your administrator if you believe you should have access to that resource."
          redirect_to root_url
        else
          authenticate_user!
        end
      end
    else
      flash[:notice] = "Sorry, we couldn't find the resource you were looking for!"
      redirect_to root_url
    end
  end

  def edit
    edit! do |format|
      @attachment = Attachment.new(:page=>@page)
      @s3provider = S3Provider.new(:key=>"attachments/#{current_user.id}")
    end
  end

  def create
    create! { (@parent_page ? page_child_path(@parent_page, @page) : @page) }
  end

  def update
    update! do |format|
      if params[:child_id]
        @parent_page = @page
        @page = Page.find(params[:child_id])
        @page.parent = @parent_page
        @page.save
      end
    end
  end

  def resource
    return @page ||= Page.find(params[:id])
    @attachments = @page.attachments
  end

  def maybe_authenticate
    unless user_signed_in?
      authenticate_user! unless current_ability.can?(:read, resource) && current_ability.can?(:read, @sitemap)
    end
  end

  def can_access_resources?
    current_ability.can?(params[:action].to_sym, resource) && current_ability.can?(params[:action].to_sym, @sitemap)
  end
end

